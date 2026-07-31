import { Module } from '@nestjs/common';
import { DayNotesService } from './day-notes.service';
import { DayNotesController } from './day-notes.controller';

@Module({
  providers: [DayNotesService],
  controllers: [DayNotesController],
})
export class DayNotesModule {}
