import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DayOfWeek, TaskType } from '@prisma/client';

export class CreateTaskTemplateDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Milk, eggs, bread' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: TaskType,
    default: TaskType.RECURRING,
    description:
      'RECURRING templates spawn a task on every matching weekday; SPECIFIC templates spawn a single one-off task for today',
  })
  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description:
      'Points awarded to the user when a day of this task is completed',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;

  @ApiPropertyOptional({
    enum: DayOfWeek,
    isArray: true,
    description: 'Days of week the task repeats on (RECURRING only)',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  repeatDays?: DayOfWeek[];

  @ApiProperty({
    example: true,
    description: 'Whether this task is mandatory to complete',
  })
  @IsBoolean()
  isRequired: boolean;

  @ApiPropertyOptional({
    example: '2026-08-01',
    description:
      'First day the task is shown on (SPECIFIC only). Defaults to today if omitted.',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-08-10',
    description:
      'Last day the task is shown on, inclusive (SPECIFIC only). Required to make the task span multiple days.',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
