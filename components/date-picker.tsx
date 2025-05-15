"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useNotesStore } from "@/lib/store"

export function DatePicker() {
  const { dateFilter, setDateFilter } = useNotesStore()
  const [open, setOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    setDateFilter(date)
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
        <Calendar mode="single" selected={dateFilter} onSelect={handleSelect} initialFocus />
        {dateFilter && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => handleSelect(undefined)}>
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
