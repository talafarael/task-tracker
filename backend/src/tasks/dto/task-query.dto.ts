import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class TaskQueryDto {
  @ApiProperty({
    example: '2026-07-23',
    description:
      'ISO date; missing task instances for matching RECURRING templates are created on the fly for this day',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
