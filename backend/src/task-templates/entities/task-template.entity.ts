import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek, TaskType } from '@prisma/client';

export class TaskTemplateEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ enum: TaskType })
  type: TaskType;

  @ApiProperty()
  points: number;

  @ApiProperty({ enum: DayOfWeek, isArray: true })
  repeatDays: DayOfWeek[];

  @ApiProperty()
  isRequired: boolean;

  @ApiProperty({ nullable: true })
  startDate: string | null;

  @ApiProperty({ nullable: true })
  endDate: string | null;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
