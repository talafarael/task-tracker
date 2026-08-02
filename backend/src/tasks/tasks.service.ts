import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus, TaskTemplate, TaskType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { dateRange, dayOfWeekFor, todayDateString } from '../common/date.util';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Spawns a Task instance for every template that occurs on `date` and
  // doesn't have one yet: RECURRING templates matching the weekday, and
  // SPECIFIC templates with an endDate at or after `date` (and, if set, a
  // startDate at or before it — an unset startDate means "from the start").
  private async ensureForDate(userId: string, date: string): Promise<void> {
    const weekday = dayOfWeekFor(date);
    const templates = await this.prisma.taskTemplate.findMany({
      where: {
        userId,
        OR: [
          { type: TaskType.RECURRING, repeatDays: { has: weekday } },
          {
            type: TaskType.SPECIFIC,
            endDate: { gte: date },
            OR: [{ startDate: null }, { startDate: { lte: date } }],
          },
        ],
      },
    });
    if (templates.length === 0) {
      return;
    }

    const existing = await this.prisma.task.findMany({
      where: {
        userId,
        date,
        templateId: { in: templates.map((template) => template.id) },
      },
      select: { templateId: true },
    });
    const existingTemplateIds = new Set(
      existing.map((task) => task.templateId),
    );
    const missing = templates.filter(
      (template) => !existingTemplateIds.has(template.id),
    );
    if (missing.length === 0) {
      return;
    }

    await this.prisma.task.createMany({
      data: missing.map((template) => ({
        templateId: template.id,
        userId,
        date,
        status: TaskStatus.TODO,
      })),
    });
  }

  // Called right after a new template is created. RECURRING templates get
  // today's instance if today matches their schedule (later days are
  // spawned lazily by ensureForDate as they're viewed). SPECIFIC templates
  // with an endDate get an instance for every day from startDate (or today,
  // if startDate is unset) through endDate, up front, so the task shows for
  // the whole period immediately. SPECIFIC templates without an endDate get
  // a single instance for today.
  async createTodayInstanceForNewTemplate(
    template: TaskTemplate,
  ): Promise<void> {
    const today = todayDateString();

    if (template.type === TaskType.RECURRING) {
      if (!template.repeatDays.includes(dayOfWeekFor(today))) {
        return;
      }
      await this.prisma.task.create({
        data: {
          templateId: template.id,
          userId: template.userId,
          date: today,
          status: TaskStatus.TODO,
        },
      });
      return;
    }

    const dates = template.endDate
      ? dateRange(template.startDate ?? today, template.endDate)
      : [today];

    await this.prisma.task.createMany({
      data: dates.map((date) => ({
        templateId: template.id,
        userId: template.userId,
        date,
        status: TaskStatus.TODO,
      })),
    });
  }

  async findAll(userId: string, query: TaskQueryDto) {
    await this.ensureForDate(userId, query.date);

    return this.prisma.task.findMany({
      where: { userId, date: query.date, status: query.status },
      include: { template: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: { template: true },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    const task = await this.findOne(userId, id);
    const pointsDelta = this.pointsDeltaFor(
      task.status,
      dto.status,
      task.template.points,
    );

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: dto,
      include: { template: true },
    });

    if (pointsDelta !== 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: pointsDelta,
          },
        },
      });
    }

    return updatedTask;
  }

  // Awards the template's points the moment a task instance becomes DONE,
  // and takes them back if it's moved off DONE again.
  private pointsDeltaFor(
    oldStatus: TaskStatus,
    newStatus: TaskStatus,
    points: number,
  ): number {
    if (newStatus === oldStatus) {
      return 0;
    }
    if (newStatus === TaskStatus.DONE) {
      return points;
    }
    if (oldStatus === TaskStatus.DONE) {
      return -points;
    }
    return 0;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.task.delete({ where: { id } });
  }
}
