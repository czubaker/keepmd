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
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Toggle date selection
  const toggleDate = (date: Date) => {
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

  // Calculate days from next month to display
  const totalDaysToShow = 42 // 6 rows of 7 days
  const nextMonthDays = Array.from({ length: totalDaysToShow - daysInMonth.length - prevMonthDays.length }, (_, i) => {
    const day = new Date(monthEnd)
    day.setDate(day.getDate() + i + 1)
    return day
  })

  // Combine all days
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays]

  // Get activity level for a date (0-4)
  const getActivityLevel = (date: Date): number => {
    const dateKey = format(date, "yyyy-MM-dd")
    const activity = activityMap.get(dateKey) || 0

    if (activity === 0) return 0

    // Normalize activity to 4 levels
    return Math.min(Math.ceil((activity / maxActivity) * 4), 4)
  }

  // Group days into weeks
  const weeks = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7))
  }

  return (
    <div className="p-4 bg-background border rounded-md shadow-sm">
      {/* Header with month/year and navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
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

              // Activity level classes
              const activityClass = isCurrentMonth
                ? ["", "bg-primary/10", "bg-primary/20", "bg-primary/30", "bg-primary/40"][activityLevel]
                : ""

              return (
                <button
                  key={dayIndex}
                  onClick={() => toggleDate(day)}
                  className={cn(
                    "h-9 w-full rounded-md flex items-center justify-center text-sm",
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                    isSelected && "ring-2 ring-primary",
                    activityClass,
                    isToday(day) && "font-bold",
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
