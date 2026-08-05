import { DayOfWeek } from '@prisma/client';

const WEEKDAYS_BY_JS_DAY: DayOfWeek[] = [
  DayOfWeek.SUNDAY,
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
];

export const dayOfWeekFor = (date: string): DayOfWeek =>
  WEEKDAYS_BY_JS_DAY[new Date(`${date}T00:00:00.000Z`).getUTCDay()];

export const todayDateString = (): string =>
  new Date().toISOString().slice(0, 10);
