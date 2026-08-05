import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskTemplateDto } from './dto/create-task-template.dto';
import { UpdateTaskTemplateDto } from './dto/update-task-template.dto';
import { todayDateString } from '../common/date.util';

@Injectable()
export class TaskTemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  async create(userId: string, dto: CreateTaskTemplateDto) {
    // PERIOD templates always get a well-defined range so the single shared
    // Task instance can be matched against any day via startDate/endDate,
    // without falling back to "unset means open-ended" checks everywhere.
    const startDate =
      dto.type === TaskType.PERIOD ? (dto.startDate ?? todayDateString()) : dto.startDate;
    const endDate =
      dto.type === TaskType.PERIOD ? (dto.endDate ?? startDate) : dto.endDate;

    const template = await this.prisma.taskTemplate.create({
      data: { ...dto, startDate, endDate, userId },
    });
    await this.tasksService.createTodayInstanceForNewTemplate(template);
    return template;
  }

  findAll(userId: string) {
    return this.prisma.taskTemplate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const template = await this.prisma.taskTemplate.findFirst({
      where: { id, userId },
    });
    if (!template) {
      throw new NotFoundException('Task template not found');
    }
    return template;
  }

  async update(userId: string, id: string, dto: UpdateTaskTemplateDto) {
    const existing = await this.findOne(userId, id);
    const data: UpdateTaskTemplateDto = { ...dto };
    const type = dto.type ?? existing.type;
    if (type === TaskType.PERIOD) {
      data.startDate = dto.startDate ?? existing.startDate ?? todayDateString();
      data.endDate = dto.endDate ?? existing.endDate ?? data.startDate;
    }
    return this.prisma.taskTemplate.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.task.deleteMany({ where: { templateId: id } });
    await this.prisma.taskTemplate.delete({ where: { id } });
  }
}
