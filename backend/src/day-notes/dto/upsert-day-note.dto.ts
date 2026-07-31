import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MaxLength } from 'class-validator';

export class UpsertDayNoteDto {
  @ApiProperty({ example: '2026-07-23' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Remember to water the plants' })
  @IsString()
  @MaxLength(10000)
  text: string;
}
