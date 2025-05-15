"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotesStore } from "@/lib/store"
import {
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isFuture,
  startOfWeek,
  endOfWeek,
  isAfter,
} from "date-fns"
import { cn } from "@/lib/utils"
import type { Note } from "@/lib/types"

interface ActivityCalendarProps {
  onSelectDates: (dates: Date[]) => void
  selectedDates: Date[]
}

export function ActivityCalendar({ onSelectDates, selectedDates }: ActivityCalendarProps) {
  const { notes } = useNotesStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [activityMap, setActivityMap] = useState<Map<string, number>>(new Map())
  const today = new Date()

  // Calculate activity for each day
  useEffect(() => {
    const map = new Map<string, number>()

    notes.forEach((note: Note) => {
      if (!note.is_archived) {
        const date = new Date(note.created_at)
        const dateKey = format(date, "yyyy-MM-dd")
        const currentCount = map.get(dateKey) || 0
        map.set(dateKey, currentCount + 1)
      }
    })

    setActivityMap(map)
  }, [notes])

  // Get the maximum activity count for normalization
  const maxActivity = Math.max(...Array.from(activityMap.values()), 1)

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    const nextMonthDate = addMonths(currentMonth, 1)
    // Only allow navigation to next month if it's not in the future
    if (!isAfter(startOfMonth(nextMonthDate), today)) {
      setCurrentMonth(nextMonthDate)
    }
  }

  // Check if next month button should be disabled
  const isNextMonthDisabled = isAfter(startOfMonth(addMonths(currentMonth, 1)), today)

  // Toggle date selection
  const toggleDate = (date: Date) => {
    // Don't allow selecting future dates
    if (isFuture(date)) return

    const isSelected = selectedDates.some((selectedDate) => isSameDay(selectedDate, date))

    if (isSelected) {
      onSelectDates(selectedDates.filter((d) => !isSameDay(d, date)))
    } else {
      onSelectDates([...selectedDates, date])
    }
  }

  // Get days to display in the calendar
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = monthStart.getDay()

  // Calculate days from previous month to display
  const prevMonthDays = Array.from({ length: startDay }, (_, i) => {
    const day = new Date(monthStart)
    day.setDate(day.getDate() - (startDay - i))
    return day
  })

  // Calculate the weeks to display
  const firstDayOfCalendar = startOfWeek(monthStart)
  const lastDayOfCalendar = endOfWeek(monthEnd)
  const allCalendarDays = eachDayOfInterval({ start: firstDayOfCalendar, end: lastDayOfCalendar })

  // Group days into weeks
  const weeks = []
  for (let i = 0; i < allCalendarDays.length; i += 7) {
    const week = allCalendarDays.slice(i, i + 7)
    // Only include weeks that have at least one day from the current month
    if (week.some((day) => isSameMonth(day, currentMonth))) {
      weeks.push(week)
    }
  }

  // Get activity level for a date (0-4)
  const getActivityLevel = (date: Date): number => {
    const dateKey = format(date, "yyyy-MM-dd")
    const activity = activityMap.get(dateKey) || 0

    if (activity === 0) return 0

    // Normalize activity to 4 levels
    return Math.min(Math.ceil((activity / maxActivity) * 4), 4)
  }

  return (
    <div className="p-4 bg-background border rounded-md shadow-sm w-[280px]">
      {/* Header with month/year and navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium text-center w-32">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button variant="ghost" size="icon" onClick={nextMonth} disabled={isNextMonthDisabled}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-sm text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isSelected = selectedDates.some((selectedDate) => isSameDay(selectedDate, day))
              const activityLevel = getActivityLevel(day)
              const isFutureDate = isFuture(day)

              // Activity level classes
              const activityClass =
                isCurrentMonth && !isFutureDate
                  ? ["", "bg-primary/10", "bg-primary/20", "bg-primary/30", "bg-primary/40"][activityLevel]
                  : ""

              return (
                <button
                  key={dayIndex}
                  onClick={() => toggleDate(day)}
                  disabled={isFutureDate}
                  className={cn(
                    "h-9 w-9 rounded-md flex items-center justify-center text-sm",
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                    isSelected && "ring-2 ring-primary",
                    activityClass,
                    isToday(day) && "font-bold",
                    isFutureDate && "opacity-30 cursor-not-allowed",
                  )}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
