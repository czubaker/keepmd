"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useNotesStore } from "@/lib/store"
import { ActivityCalendar } from "./activity-calendar"

export function CalendarFilter() {
  const { selectedDates, setSelectedDates } = useNotesStore()
  const [open, setOpen] = useState(false)

  const handleSelectDates = (dates: Date[]) => {
    setSelectedDates(dates)
  }

  const clearDates = () => {
    setSelectedDates([])
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className={cn(selectedDates.length > 0 && "bg-primary/10")}>
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <ActivityCalendar onSelectDates={handleSelectDates} selectedDates={selectedDates} />
          {selectedDates.length > 0 && (
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full justify-center" onClick={clearDates}>
                Clear dates
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
