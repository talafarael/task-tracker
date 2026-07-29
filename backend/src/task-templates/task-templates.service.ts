import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskTemplateDto } from './dto/create-task-template.dto';
import { UpdateTaskTemplateDto } from './dto/update-task-template.dto';

@Injectable()
export class TaskTemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  async create(userId: string, dto: CreateTaskTemplateDto) {
    const template = await this.prisma.taskTemplate.create({
      data: { ...dto, userId },
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
    await this.findOne(userId, id);
    return this.prisma.taskTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.task.deleteMany({ where: { templateId: id } });
    await this.prisma.taskTemplate.delete({ where: { id } });
  }
}
