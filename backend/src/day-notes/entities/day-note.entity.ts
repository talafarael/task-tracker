import { ApiProperty } from '@nestjs/swagger';

export class DayNoteEntity {
  @ApiProperty({ example: '2026-07-23' })
  date: string;

  @ApiProperty()
  text: string;
}
