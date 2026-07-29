import { useState } from 'react'
import { DAY_OF_WEEK_LABELS } from '@/entities/task'
import { dayOfWeekFor, shiftDate, toDateString } from '@/shared/lib/date'

interface DateStripProps {
  selectedDate: string
  onSelect: (date: string) => void
}

const VISIBLE_DAYS = 7

export const DateStrip = ({ selectedDate, onSelect }: DateStripProps) => {
  const [windowStart, setWindowStart] = useState(selectedDate)
  const today = toDateString(new Date())

  const dates = Array.from({ length: VISIBLE_DAYS }, (_, index) =>
    shiftDate(windowStart, index),
  )

  const shiftWindow = (days: number) =>
    setWindowStart((current) => shiftDate(current, days))

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => shiftWindow(-1)}
        aria-label="Previous day"
        className="shrink-0 rounded-md border border-brown-300 px-2 py-3 text-brown-700 hover:bg-cream-200"
      >
        ←
      </button>

      <div className="grid flex-1 grid-cols-7 gap-2">
        {dates.map((dateStr) => {
          const isToday = dateStr === today
          const isSelected = dateStr === selectedDate
          const dayNumber = Number(dateStr.slice(-2))
          const weekdayLabel = DAY_OF_WEEK_LABELS[dayOfWeekFor(dateStr)]

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelect(dateStr)}
              className={`flex flex-col items-center gap-1 rounded-lg px-2 py-4 transition-colors ${
                isSelected
                  ? 'bg-brown-700 text-cream-50'
                  : isToday
                    ? 'border border-brown-400 bg-cream-100 text-brown-800'
                    : 'bg-cream-200 text-brown-700 hover:bg-cream-300'
              }`}
            >
              <span className="text-sm font-medium">{weekdayLabel}</span>
              <span className="text-2xl font-semibold">{dayNumber}</span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => shiftWindow(1)}
        aria-label="Next day"
        className="shrink-0 rounded-md border border-brown-300 px-2 py-3 text-brown-700 hover:bg-cream-200"
      >
        →
      </button>
    </div>
  )
}
