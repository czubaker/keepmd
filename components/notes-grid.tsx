"use client"

import { useEffect } from "react"
import { useNotesStore } from "@/lib/store"
import { NoteCard } from "./note-card"
import { useAuth } from "./auth/auth-context"
import type { Note } from "@/lib/types"
import { isSameDay } from "date-fns"

export function NotesGrid() {
  const {
    notes,
    fetchNotes,
    fetchTags,
    searchQuery,
    selectedTags,
    showArchived,
    dateFilter,
    setupRealtimeSubscription,
    cleanupSubscription,
  } = useNotesStore()
  const { user, isLoading: isAuthLoading } = useAuth()

  useEffect(() => {
    if (user) {
      // Initial data fetch
      fetchNotes(user.id)
      fetchTags(user.id)

      // Setup realtime subscription
      setupRealtimeSubscription(user.id)

      // Cleanup subscription on unmount
      return () => {
        cleanupSubscription()
      }
    }
  }, [user, fetchNotes, fetchTags, setupRealtimeSubscription, cleanupSubscription])

  if (isAuthLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please log in to view your notes</p>
      </div>
    )
  }

  // Filter notes based on search query, selected tags, archive status, and date
  const filteredNotes = notes.filter((note: Note) => {
    // Filter by archive status
    if (!showArchived && note.is_archived) return false
    if (showArchived && !note.is_archived) return false

    // Filter by search query
    if (searchQuery && !note.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      const noteTags = note.tags || []
      const noteTagIds = noteTags.map((tag: any) => tag.id)
      if (!selectedTags.some((tagId) => noteTagIds.includes(tagId))) {
        return false
      }
    }

    // Filter by date
    if (dateFilter) {
      const noteDate = new Date(note.created_at)
      if (!isSameDay(noteDate, dateFilter)) {
        return false
      }
    }

    return true
  })

  // Separate pinned and unpinned notes
  const pinnedNotes = filteredNotes.filter((note: Note) => note.is_pinned)
  const unpinnedNotes = filteredNotes.filter((note: Note) => !note.is_pinned)

  if (filteredNotes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {notes.length === 0
            ? "No notes yet. Create your first note above!"
            : showArchived
              ? "No archived notes found."
              : "No notes match your current filters."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-4">Pinned</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pinnedNotes.map((note: Note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}

      {unpinnedNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && <h2 className="text-lg font-medium mb-4">Others</h2>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unpinnedNotes.map((note: Note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
