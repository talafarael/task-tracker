import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertDayNoteDto } from './dto/upsert-day-note.dto';

@Injectable()
export class DayNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: string, date: string) {
    const note = await this.prisma.dayNote.findUnique({
      where: { userId_date: { userId, date } },
    });
    return { date, text: note?.text ?? '' };
  }

  async upsert(userId: string, dto: UpsertDayNoteDto) {
    const note = await this.prisma.dayNote.upsert({
      where: { userId_date: { userId, date: dto.date } },
      create: { userId, date: dto.date, text: dto.text },
      update: { text: dto.text },
    });
    return { date: note.date, text: note.text };
  }
}
