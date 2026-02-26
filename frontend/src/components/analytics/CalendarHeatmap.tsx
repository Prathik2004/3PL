"use client"

import React from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay
} from "date-fns"

const DAYS_HEADER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Mock intensity data logic
const getIntensityClass = (level: number) => {
  const levels: Record<number, string> = {
    1: "bg-[#F1F5F9]",
    2: "bg-[#DBEAFE]",
    3: "bg-[#93C5FD]",
    4: "bg-[#3B82F6]",
    5: "bg-[#1D4ED8]",
  }
  return levels[level] || "bg-[#F8FAFC]"
}

export function MonthlyExceptionHeatmap({ targetDate }: { targetDate?: Date }) {
  const [currentDate, setCurrentDate] = React.useState<Date | null>(null)

  React.useEffect(() => {
    setCurrentDate(targetDate || new Date())
  }, [targetDate])

  if (!currentDate) return <div className="h-[400px] w-full bg-white animate-pulse rounded-2xl" />

  const start = startOfMonth(currentDate)
  const end = endOfMonth(start)

  // 2. Generate exactly the number of days in that month (30, 31, etc.)
  const daysInMonth = eachDayOfInterval({ start, end }).map(date => ({
    date,
    // Use a deterministic value based on the date to avoid hydration mismatch
    weight: ((date.getDate() * 7) % 5) + 1
  }))

  // 3. Calculate offset for the first day of the week
  const firstDayOfMonth = getDay(daysInMonth[0].date)
  const blanks = Array(firstDayOfMonth).fill(null)

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm w-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-[#0F172A] font-bold text-xl">Monthly Exception Trends</h3>
          <p className="text-[14px] text-[#64748B] mt-1">
            Operational exceptions for {format(start, 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Low</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((l) => (
              <div key={l} className={`w-4 h-4 rounded-sm ${getIntensityClass(l)}`} />
            ))}
          </div>
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">High</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {DAYS_HEADER.map(day => (
          <span key={day} className="text-[12px] font-bold text-[#64748B] text-center mb-2">
            {day}
          </span>
        ))}

        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="h-14 w-full bg-transparent" />
        ))}

        {/* This will map exactly 28, 30, or 31 days based on the interval calculated above */}
        {daysInMonth.map((entry) => (
          <div
            key={entry.date.toString()}
            className={`group relative h-14 w-full rounded-lg transition-all hover:ring-2 hover:ring-slate-200 cursor-pointer flex items-center justify-center ${getIntensityClass(entry.weight)}`}
          >
            <span className={`text-[12px] font-semibold ${entry.weight > 3 ? 'text-white' : 'text-[#64748B]'}`}>
              {format(entry.date, 'd')}
            </span>

            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#0F172A] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
              {entry.weight} Exceptions on {format(entry.date, 'MMM do')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}