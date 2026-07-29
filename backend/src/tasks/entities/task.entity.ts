import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { TaskTemplateEntity } from '../../task-templates/entities/task-template.entity';

export class TaskEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: '2026-07-23' })
  date: string;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  templateId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: () => TaskTemplateEntity })
  template: TaskTemplateEntity;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
