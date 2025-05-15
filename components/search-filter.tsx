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
import { ActivityCalendar } from "./activity-calendar"
import { format } from "date-fns"

export function SearchFilter() {
  const {
    searchQuery,
    setSearchQuery,
    tags,
    selectedTags,
    setSelectedTags,
    showArchived,
    toggleShowArchived,
    dateFilter,
  } = useNotesStore()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

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
    if (showArchived) {
      toggleShowArchived()
    }
  }

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || showArchived || dateFilter

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className={`relative flex-grow ${isSearchFocused ? "ring-2 ring-primary ring-offset-2" : ""}`}>
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
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

        <ActivityCalendar />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Tag className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tags.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No tags available</div>
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
          title={showArchived ? "Showing archived notes" : "Show archived notes"}
        >
          <Archive className="h-4 w-4" />
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear filters
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

      {dateFilter && (
        <div className="flex items-center">
          <Badge variant="outline" className="flex items-center gap-1">
            Date: {format(dateFilter, "MMM d, yyyy")}
          </Badge>
        </div>
      )}
    </div>
  )
}
