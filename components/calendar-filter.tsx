"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useNotesStore } from "@/lib/store"
import { ActivityCalendar } from "./activity-calendar"
import { useLanguage } from "./language-context"

export function CalendarFilter() {
  const { selectedDates, setSelectedDates } = useNotesStore()
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const handleSelectDates = (dates: Date[]) => {
    setSelectedDates(dates)
  }

  const clearDates = () => {
    setSelectedDates([])
    setOpen(false)
  }

  return (
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
              {t("notes.clearFilters")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
