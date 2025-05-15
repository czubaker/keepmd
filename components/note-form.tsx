"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useNotesStore } from "@/lib/store"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PlusCircle, Tag, X, Palette } from "lucide-react"
import { useAuth } from "./auth/auth-context"
import { MarkdownHelp } from "./markdown-help"
import { NotePreview } from "./note-preview"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "./language-context"

const COLORS = [
  "bg-white dark:bg-zinc-800",
  "bg-red-100 dark:bg-red-900",
  "bg-orange-100 dark:bg-orange-900",
  "bg-yellow-100 dark:bg-yellow-900",
  "bg-green-100 dark:bg-green-900",
  "bg-blue-100 dark:bg-blue-900",
  "bg-purple-100 dark:bg-purple-900",
  "bg-pink-100 dark:bg-pink-900",
]

export function NoteForm() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false)
  const { addNote, tags, addTag } = useNotesStore()
  const { user } = useAuth()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isMobile = useMobile()
  const { t } = useLanguage()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && isExpanded) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content, isExpanded])

  const handleSubmit = async () => {
    if (content.trim() && user) {
      const note = await addNote({
        user_id: user.id,
        content,
        color: selectedColor,
        is_pinned: false,
        is_archived: false,
      })

      // Add selected tags to the note
      if (note && selectedTags.length > 0) {
        for (const tagId of selectedTags) {
          await addTagToNote(note.id, tagId)
        }
      }

      setContent("")
      setSelectedColor(COLORS[0])
      setSelectedTags([])
      setIsExpanded(false)
    }
  }

  const handleAddTag = async () => {
    if (newTagName.trim() && user) {
      const tagId = await addTag(newTagName.trim(), user.id)
      if (tagId) {
        setSelectedTags([...selectedTags, tagId])
        setNewTagName("")
      }
    }
  }

  const toggleTagSelection = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId))
  }

  // This is a mock function since we don't have the actual note ID yet
  const addTagToNote = async (noteId: string, tagId: string) => {
    // This will be handled by the store after the note is created
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const ColorSelector = () => {
    if (isMobile) {
      return (
        <DropdownMenu open={isColorMenuOpen} onOpenChange={setIsColorMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2">
            <div className="grid grid-cols-4 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`h-6 w-6 rounded-full ${color} border ${color === selectedColor ? "ring-2 ring-primary ring-offset-1" : ""}`}
                  onClick={() => {
                    setSelectedColor(color)
                    setIsColorMenuOpen(false)
                  }}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <>
        {COLORS.map((color) => (
          <button
            key={color}
            className={`h-8 w-8 rounded-full ${color} border ${color === selectedColor ? "ring-2 ring-primary ring-offset-2" : ""}`}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </>
    )
  }

  return (
    <Card className={`mb-8 ${selectedColor} border transition-colors duration-200`}>
      <CardContent className="pt-6">
        {isExpanded ? (
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder={`${t("notes.takeNote")} (Markdown ${t("notes.markdownSupported").toLowerCase()})`}
              className="min-h-[100px] resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
              value={content}
              onChange={handleContentChange}
              autoFocus
            />
            <div className="absolute top-2 right-2">
              <MarkdownHelp />
            </div>
            {isExpanded && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <span>{t("notes.markdownSupported")}</span>
              </div>
            )}
            <NotePreview content={content} />

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-4">
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId)
                  return tag ? (
                    <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                      {tag.name}
                      <button onClick={() => removeTag(tag.id)} className="h-3 w-3 rounded-full">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center cursor-text p-2" onClick={() => setIsExpanded(true)}>
            <PlusCircle className="mr-2 h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{t("notes.takeNote")}</span>
          </div>
        )}
      </CardContent>

      {isExpanded && (
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <ColorSelector />
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsTagDialogOpen(true)} title={t("notes.manageTags")}>
              <Tag className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsExpanded(false)
                setContent("")
                setSelectedTags([])
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              {t("actions.add")}
            </Button>
          </div>
        </CardFooter>
      )}

      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("notes.manageTags")}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              placeholder={t("notes.addNewTag")}
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTag()
                }
              }}
            />
            <Button onClick={handleAddTag}>{t("actions.add")}</Button>
          </div>
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium">{t("notes.availableTags")}</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id)
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTagSelection(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                )
              })}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTagDialogOpen(false)}>{t("actions.done")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
