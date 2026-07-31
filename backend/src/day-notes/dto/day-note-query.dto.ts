import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class DayNoteQueryDto {
  @ApiProperty({ example: '2026-07-23' })
  @IsDateString()
  date: string;
}
