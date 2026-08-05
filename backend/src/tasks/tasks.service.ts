import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus, TaskTemplate, TaskType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { dayOfWeekFor, todayDateString } from '../common/date.util';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Spawns Task instances needed to view `date`: a RECURRING instance for
  // every template matching the weekday that doesn't have one yet, and a
  // PERIOD instance for every template whose range covers `date` but has no
  // Task at all yet (PERIOD templates normally get their single Task up
  // front at creation — this is just a fallback for templates edited after
  // the fact).
  private async ensureForDate(userId: string, date: string): Promise<void> {
    const weekday = dayOfWeekFor(date);

    const recurringTemplates = await this.prisma.taskTemplate.findMany({
      where: { userId, type: TaskType.RECURRING, repeatDays: { has: weekday } },
    });
    if (recurringTemplates.length > 0) {
      const existing = await this.prisma.task.findMany({
        where: {
          userId,
          date,
          templateId: { in: recurringTemplates.map((template) => template.id) },
        },
        select: { templateId: true },
      });
      const existingTemplateIds = new Set(
        existing.map((task) => task.templateId),
      );
      const missing = recurringTemplates.filter(
        (template) => !existingTemplateIds.has(template.id),
      );
      if (missing.length > 0) {
        await this.prisma.task.createMany({
          data: missing.map((template) => ({
            templateId: template.id,
            userId,
            date,
            status: TaskStatus.TODO,
          })),
        });
      }
    }

    const periodTemplatesMissingTask = await this.prisma.taskTemplate.findMany({
      where: {
        userId,
        type: TaskType.PERIOD,
        startDate: { lte: date },
        endDate: { gte: date },
        tasks: { none: {} },
      },
    });
    if (periodTemplatesMissingTask.length > 0) {
      await this.prisma.task.createMany({
        data: periodTemplatesMissingTask.map((template) => ({
          templateId: template.id,
          userId,
          date: template.startDate ?? date,
          status: TaskStatus.TODO,
        })),
      });
    }
  }

  // Called right after a new template is created. RECURRING templates get
  // today's instance if today matches their schedule (later days are
  // spawned lazily by ensureForDate as they're viewed). PERIOD templates get
  // exactly one instance, anchored on startDate — that single instance is
  // shown on every day in [startDate, endDate], so completing it anywhere
  // completes it everywhere.
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

    await this.prisma.task.create({
      data: {
        templateId: template.id,
        userId: template.userId,
        date: template.startDate ?? today,
        status: TaskStatus.TODO,
      },
    });
  }

  async findAll(userId: string, query: TaskQueryDto) {
    await this.ensureForDate(userId, query.date);

    const [recurringTasks, periodTasks] = await Promise.all([
      this.prisma.task.findMany({
        where: {
          userId,
          date: query.date,
          status: query.status,
          template: { type: TaskType.RECURRING },
        },
        include: { template: true },
      }),
      this.prisma.task.findMany({
        where: {
          userId,
          status: query.status,
          template: {
            type: TaskType.PERIOD,
            startDate: { lte: query.date },
            endDate: { gte: query.date },
          },
        },
        include: { template: true },
      }),
    ]);

    return [...recurringTasks, ...periodTasks].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
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
