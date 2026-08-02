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

// All ISO date strings from `start` to `end`, inclusive.
export const dateRange = (start: string, end: string): string[] => {
  const dates: string[] = [];
  let cursor = new Date(`${start}T00:00:00.000Z`);
  const last = new Date(`${end}T00:00:00.000Z`);
  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  }
  return dates;
};
