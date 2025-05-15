"use client"

import { create } from "zustand"
import { supabase } from "./supabase/client"
import type { Note, Tag } from "./types"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface NotesState {
  notes: Note[]
  tags: Tag[]
  isLoading: boolean
  searchQuery: string
  selectedTags: string[]
  showArchived: boolean
  subscription: RealtimeChannel | null
  dateFilter: Date | undefined

  // Fetch operations
  fetchNotes: (userId: string) => Promise<void>
  fetchTags: (userId: string) => Promise<void>
  setupRealtimeSubscription: (userId: string) => void
  cleanupSubscription: () => void

  // Note operations
  addNote: (note: Omit<Note, "id" | "created_at" | "updated_at" | "tags">) => Promise<void>
  updateNote: (id: string, updates: Partial<Omit<Note, "id" | "created_at" | "updated_at" | "tags">>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  togglePinned: (id: string) => Promise<void>
  toggleArchived: (id: string) => Promise<void>

  // Tag operations
  addTag: (name: string, userId: string) => Promise<string | null>
  deleteTag: (id: string) => Promise<void>
  addTagToNote: (noteId: string, tagId: string) => Promise<void>
  removeTagFromNote: (noteId: string, tagId: string) => Promise<void>

  // UI state
  setSearchQuery: (query: string) => void
  setSelectedTags: (tags: string[]) => void
  toggleShowArchived: () => void
  setDateFilter: (date: Date | undefined) => void
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  tags: [],
  isLoading: false,
  searchQuery: "",
  selectedTags: [],
  showArchived: false,
  subscription: null,
  dateFilter: undefined,

  setupRealtimeSubscription: (userId: string) => {
    // Clean up existing subscription if any
    get().cleanupSubscription()

    // Create a new subscription
    const subscription = supabase
      .channel("notes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Handle different events
          if (payload.eventType === "INSERT") {
            const newNote = payload.new as Note
            set((state) => ({
              notes: [{ ...newNote, tags: [] }, ...state.notes],
            }))
          } else if (payload.eventType === "UPDATE") {
            const updatedNote = payload.new as Note
            set((state) => ({
              notes: state.notes.map((note) => (note.id === updatedNote.id ? { ...note, ...updatedNote } : note)),
            }))
          } else if (payload.eventType === "DELETE") {
            const deletedNote = payload.old as Note
            set((state) => ({
              notes: state.notes.filter((note) => note.id !== deletedNote.id),
            }))
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tags",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Refetch tags when changes occur
          get().fetchTags(userId)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "note_tags",
        },
        () => {
          // Refetch notes when note_tags change
          get().fetchNotes(userId)
        },
      )
      .subscribe()

    set({ subscription })
  },

  cleanupSubscription: () => {
    const { subscription } = get()
    if (subscription) {
      subscription.unsubscribe()
    }
    set({ subscription: null })
  },

  fetchNotes: async (userId: string) => {
    set({ isLoading: true })

    try {
      // Fetch notes
      const { data: notes, error } = await supabase
        .from("notes")
        .select(`
          *,
          tags:note_tags(
            tag:tags(*)
          )
        `)
        .eq("user_id", userId)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error

      // Process notes to extract tags
      const processedNotes = notes.map((note) => {
        const processedNote = { ...note } as Note

        // Extract tags from the nested structure
        if (note.tags) {
          processedNote.tags = note.tags.map((tagObj: any) => tagObj.tag).filter(Boolean)
        }

        return processedNote
      })

      set({ notes: processedNotes, isLoading: false })
    } catch (error) {
      console.error("Error fetching notes:", error)
      set({ isLoading: false })
    }
  },

  fetchTags: async (userId: string) => {
    try {
      const { data, error } = await supabase.from("tags").select("*").eq("user_id", userId).order("name")

      if (error) throw error

      set({ tags: data })
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  },

  addNote: async (note) => {
    try {
      const { data, error } = await supabase.from("notes").insert(note).select()

      if (error) throw error

      // Optimistically update the UI
      if (data && data.length > 0) {
        const newNote = { ...data[0], tags: [] } as Note
        set((state) => ({
          notes: [newNote, ...state.notes],
        }))
      }
    } catch (error) {
      console.error("Error adding note:", error)
    }
  },

  updateNote: async (id, updates) => {
    try {
      const { error } = await supabase
        .from("notes")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error

      // Optimistically update the UI
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, ...updates, updated_at: new Date().toISOString() } : note,
        ),
      }))
    } catch (error) {
      console.error("Error updating note:", error)
    }
  },

  deleteNote: async (id) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id)

      if (error) throw error

      // Optimistically update the UI
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }))
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  },

  togglePinned: async (id) => {
    const note = get().notes.find((n) => n.id === id)
    if (!note) return

    try {
      // Optimistically update the UI
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? { ...n, is_pinned: !n.is_pinned } : n)),
      }))

      await get().updateNote(id, { is_pinned: !note.is_pinned })
    } catch (error) {
      console.error("Error toggling pin status:", error)
      // Revert on error
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? { ...n, is_pinned: note.is_pinned } : n)),
      }))
    }
  },

  toggleArchived: async (id) => {
    const note = get().notes.find((n) => n.id === id)
    if (!note) return

    try {
      // Optimistically update the UI
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? { ...n, is_archived: !n.is_archived } : n)),
      }))

      await get().updateNote(id, { is_archived: !note.is_archived })
    } catch (error) {
      console.error("Error toggling archive status:", error)
      // Revert on error
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? { ...n, is_archived: note.is_archived } : n)),
      }))
    }
  },

  addTag: async (name, userId) => {
    try {
      // Check if tag already exists
      const { data: existingTags } = await supabase.from("tags").select("*").eq("name", name).eq("user_id", userId)

      if (existingTags && existingTags.length > 0) {
        return existingTags[0].id
      }

      // Create new tag
      const { data, error } = await supabase.from("tags").insert({ name, user_id: userId }).select()

      if (error) throw error

      // Optimistically update the UI
      if (data && data.length > 0) {
        set((state) => ({
          tags: [...state.tags, data[0]],
        }))
        return data[0].id
      }
      return null
    } catch (error) {
      console.error("Error adding tag:", error)
      return null
    }
  },

  deleteTag: async (id) => {
    try {
      const { error } = await supabase.from("tags").delete().eq("id", id)

      if (error) throw error

      // Optimistically update the UI
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        selectedTags: state.selectedTags.filter((tagId) => tagId !== id),
      }))
    } catch (error) {
      console.error("Error deleting tag:", error)
    }
  },

  addTagToNote: async (noteId, tagId) => {
    try {
      const { error } = await supabase.from("note_tags").insert({ note_id: noteId, tag_id: tagId })

      if (error) throw error

      // Optimistically update the UI
      const tag = get().tags.find((t) => t.id === tagId)
      if (tag) {
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id === noteId) {
              const currentTags = note.tags || []
              // Only add if not already present
              if (!currentTags.some((t) => t.id === tagId)) {
                return {
                  ...note,
                  tags: [...currentTags, tag],
                }
              }
            }
            return note
          }),
        }))
      }
    } catch (error) {
      console.error("Error adding tag to note:", error)
    }
  },

  removeTagFromNote: async (noteId, tagId) => {
    try {
      const { error } = await supabase.from("note_tags").delete().eq("note_id", noteId).eq("tag_id", tagId)

      if (error) throw error

      // Optimistically update the UI
      set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id === noteId && note.tags) {
            return {
              ...note,
              tags: note.tags.filter((tag) => tag.id !== tagId),
            }
          }
          return note
        }),
      }))
    } catch (error) {
      console.error("Error removing tag from note:", error)
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  toggleShowArchived: () => set((state) => ({ showArchived: !state.showArchived })),
  setDateFilter: (date) => set({ dateFilter: date }),
}))
