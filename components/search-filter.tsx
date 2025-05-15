"use client"

import { useState } from "react"
import { useNotesStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Archive, Search, Tag, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarFilter } from "./calendar-filter"
import { format } from "date-fns"
import { useLanguage } from "./language-context"

export function SearchFilter() {
  const {
    searchQuery,
    setSearchQuery,
    tags,
    selectedTags,
    setSelectedTags,
    showArchived,
    toggleShowArchived,
    selectedDates,
    setSelectedDates,
  } = useNotesStore()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { t } = useLanguage()

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSelectedDates([])
    if (showArchived) {
      toggleShowArchived()
    }
  }

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || showArchived || selectedDates.length > 0

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className={`relative flex-grow ${isSearchFocused ? "ring-2 ring-primary ring-offset-2" : ""}`}>
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("notes.searchNotes")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <CalendarFilter />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Tag className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t("notes.filterByTags")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tags.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">{t("notes.noTagsAvailable")}</div>
            ) : (
              tags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </DropdownMenuCheckboxItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={showArchived ? "default" : "outline"}
          size="icon"
          onClick={toggleShowArchived}
          title={showArchived ? t("notes.showingArchivedNotes") : t("notes.showArchivedNotes")}
        >
          <Archive className="h-4 w-4" />
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={handleClearFilters} title={t("notes.clearFilters")}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId)
            return tag ? (
              <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                {tag.name}
                <button onClick={() => handleTagToggle(tag.id)} className="h-3 w-3 rounded-full">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null
          })}
        </div>
      )}

      {selectedDates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDates.map((date, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {t("notes.date")}: {format(date, "MMM d, yyyy")}
              <button
                onClick={() => setSelectedDates(selectedDates.filter((d, i) => i !== index))}
                className="h-3 w-3 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
