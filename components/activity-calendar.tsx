"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotesStore } from "@/lib/store"
import { format, getYear, getMonth, isSameDay, isSameMonth, isSameYear } from "date-fns"

type ViewMode = "days" | "months" | "years"

export function ActivityCalendar() {
  const { notes, setDateFilter, dateFilter } = useNotesStore()
  const [open, setOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("days")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activityMap, setActivityMap] = useState<Map<string, number>>(new Map())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(dateFilter)

  // Calculate activity map for highlighting
  useEffect(() => {
    const map = new Map<string, number>()

    notes.forEach((note) => {
      const date = new Date(note.created_at)

      // For days view
      const dayKey = format(date, "yyyy-MM-dd")
      map.set(dayKey, (map.get(dayKey) || 0) + 1)

      // For months view
      const monthKey = format(date, "yyyy-MM")
      map.set(monthKey, (map.get(monthKey) || 0) + 1)

      // For years view
      const yearKey = format(date, "yyyy")
      map.set(yearKey, (map.get(yearKey) || 0) + 1)
    })

    setActivityMap(map)
  }, [notes])

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setDateFilter(date)
    setOpen(false)
  }

  // Get activity level (0-3) for a given date
  const getActivityLevel = (date: Date, mode: ViewMode): number => {
    let key: string

    if (mode === "days") {
      key = format(date, "yyyy-MM-dd")
    } else if (mode === "months") {
      key = format(date, "yyyy-MM")
    } else {
      key = format(date, "yyyy")
    }

    const count = activityMap.get(key) || 0

    // Scale activity level based on count
    if (count === 0) return 0
    if (count <= 2) return 1
    if (count <= 5) return 2
    return 3
  }

  // Custom day rendering with activity highlighting
  const renderDay = (day: Date) => {
    const activityLevel = getActivityLevel(day, "days")
    const isSelected = selectedDate && isSameDay(day, selectedDate)

    return (
      <div
        className={cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          isSelected && "bg-primary text-primary-foreground rounded-md",
          activityLevel > 0 && !isSelected && "bg-primary/10 rounded-md",
          activityLevel > 1 && !isSelected && "bg-primary/20",
          activityLevel > 2 && !isSelected && "bg-primary/30",
        )}
      >
        {format(day, "d")}
      </div>
    )
  }

  // Render months view
  const renderMonths = () => {
    const year = getYear(currentDate)
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1))

    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {months.map((month) => {
          const activityLevel = getActivityLevel(month, "months")
          const isSelected = selectedDate && isSameMonth(month, selectedDate) && isSameYear(month, selectedDate)

          return (
            <Button
              key={month.toString()}
              variant="ghost"
              className={cn(
                "h-10 justify-center",
                isSelected && "bg-primary text-primary-foreground",
                activityLevel > 0 && !isSelected && "bg-primary/10",
                activityLevel > 1 && !isSelected && "bg-primary/20",
                activityLevel > 2 && !isSelected && "bg-primary/30",
              )}
              onClick={() => {
                setCurrentDate(month)
                setViewMode("days")
              }}
            >
              {format(month, "MMM")}
            </Button>
          )
        })}
      </div>
    )
  }

  // Render years view
  const renderYears = () => {
    const currentYear = new Date().getFullYear()
    const startYear = Math.max(2020, currentYear - 9) // Show at most 10 years, starting from 2020 or (currentYear - 9)
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => new Date(startYear + i, 0, 1))

    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {years.map((year) => {
          const activityLevel = getActivityLevel(year, "years")
          const isSelected = selectedDate && isSameYear(year, selectedDate)

          return (
            <Button
              key={year.toString()}
              variant="ghost"
              className={cn(
                "h-10 justify-center",
                isSelected && "bg-primary text-primary-foreground",
                activityLevel > 0 && !isSelected && "bg-primary/10",
                activityLevel > 1 && !isSelected && "bg-primary/20",
                activityLevel > 2 && !isSelected && "bg-primary/30",
              )}
              onClick={() => {
                setCurrentDate(year)
                setViewMode("months")
              }}
            >
              {format(year, "yyyy")}
            </Button>
          )
        })}
      </div>
    )
  }

  // Render calendar header with navigation
  const renderCalendarHeader = () => {
    let title: string
    let onTitleClick: () => void

    if (viewMode === "days") {
      title = format(currentDate, "MMMM yyyy")
      onTitleClick = () => setViewMode("months")
    } else if (viewMode === "months") {
      title = format(currentDate, "yyyy")
      onTitleClick = () => setViewMode("years")
    } else {
      const startYear = Math.max(2020, getYear(currentDate) - 4)
      const endYear = Math.min(new Date().getFullYear(), startYear + 9)
      title = `${startYear} - ${endYear}`
      onTitleClick = () => {} // No action for years view title
    }

    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (viewMode === "days") {
              setCurrentDate(new Date(getYear(currentDate), getMonth(currentDate) - 1, 1))
            } else if (viewMode === "months") {
              setCurrentDate(new Date(getYear(currentDate) - 1, 0, 1))
            } else {
              const startYear = Math.max(2020, getYear(currentDate) - 10)
              setCurrentDate(new Date(startYear, 0, 1))
            }
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="ghost" onClick={onTitleClick} className="font-medium">
          {title}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (viewMode === "days") {
              setCurrentDate(new Date(getYear(currentDate), getMonth(currentDate) + 1, 1))
            } else if (viewMode === "months") {
              setCurrentDate(new Date(getYear(currentDate) + 1, 0, 1))
            } else {
              const currentYear = new Date().getFullYear()
              const startYear = Math.min(currentYear - 9, getYear(currentDate) + 10)
              setCurrentDate(new Date(startYear, 0, 1))
            }
          }}
          disabled={viewMode === "years" && getYear(currentDate) + 10 > new Date().getFullYear()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(undefined)
    setDateFilter(undefined)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className={cn(dateFilter && "bg-primary/10")}>
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-2">
          {renderCalendarHeader()}

          {viewMode === "days" && (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              month={currentDate}
              onMonthChange={setCurrentDate}
              className="border-none"
              components={{
                Day: ({ date, ...props }) => (
                  <Button {...props} className="h-9 w-9 p-0 font-normal">
                    {renderDay(date)}
                  </Button>
                ),
              }}
            />
          )}

          {viewMode === "months" && renderMonths()}

          {viewMode === "years" && renderYears()}

          {dateFilter && (
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full justify-center" onClick={clearDateFilter}>
                Clear filter
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
