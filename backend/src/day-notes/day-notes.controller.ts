import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DayNotesService } from './day-notes.service';
import { DayNoteQueryDto } from './dto/day-note-query.dto';
import { UpsertDayNoteDto } from './dto/upsert-day-note.dto';
import { DayNoteEntity } from './entities/day-note.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('day-notes')
@ApiBearerAuth()
@Controller('day-notes')
export class DayNotesController {
  constructor(private readonly dayNotesService: DayNotesService) {}

  @Get()
  @ApiOperation({
    summary: "Get a day's free-text note (empty text if none saved yet)",
  })
  @ApiResponse({ status: 200, type: DayNoteEntity })
  findOne(
    @CurrentUser('userId') userId: string,
    @Query() query: DayNoteQueryDto,
  ) {
    return this.dayNotesService.findOne(userId, query.date);
  }

  @Put()
  @ApiOperation({ summary: "Create or replace a day's free-text note" })
  @ApiResponse({ status: 200, type: DayNoteEntity })
  upsert(@CurrentUser('userId') userId: string, @Body() dto: UpsertDayNoteDto) {
    return this.dayNotesService.upsert(userId, dto);
  }
}
