"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useNotesStore } from "@/lib/store"
import { Archive, ArchiveRestore, Edit, Pin, PinOff, Tag, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { format } from "date-fns"
import type { Note, Tag as TagType } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "./auth/auth-context"

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const { updateNote, deleteNote, togglePinned, toggleArchived, tags, addTag, addTagToNote, removeTagFromNote } =
    useNotesStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note.content)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const { user } = useAuth()

  const handleSaveEdit = async () => {
    if (editContent.trim()) {
      await updateNote(note.id, { content: editContent })
      setIsEditing(false)
    }
  }

  const handleAddTag = async () => {
    if (newTagName.trim() && user) {
      const tagId = await addTag(newTagName.trim(), user.id)
      if (tagId) {
        await addTagToNote(note.id, tagId)
        setNewTagName("")
      }
    }
  }

  const handleRemoveTag = async (tagId: string) => {
    await removeTagFromNote(note.id, tagId)
  }

  const noteTags = note.tags || []

  return (
    <Card className={`${note.color} border transition-colors duration-200 h-full flex flex-col`}>
      <CardContent className="pt-6 flex-grow overflow-auto">
        {isEditing ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[100px] resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        ) : (
          <div className="prose dark:prose-invert prose-sm max-w-none break-words">
            <ReactMarkdown
              components={{
                // Override h1, h2, h3 to ensure proper styling
                h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-0" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mt-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mt-2" {...props} />,
                p: ({ node, ...props }) => <p className="mt-2" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 pl-4 italic" {...props} />,
                code: ({ node, ...props }) => <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />,
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        )}

        {noteTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {noteTags.map((tag: TagType) => (
              <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                {tag.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveTag(tag.id)
                  }}
                  className="h-3 w-3 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t">
        <span className="text-xs text-muted-foreground">{format(new Date(note.created_at), "MMM d, yyyy")}</span>
        <div className="flex items-center space-x-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSaveEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsTagDialogOpen(true)}>
                <Tag className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => togglePinned(note.id)}>
                {note.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toggleArchived(note.id)}>
                {note.is_archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>

      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add new tag"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTag()
                }
              }}
            />
            <Button onClick={handleAddTag}>Add</Button>
          </div>
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium">Available Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = noteTags.some((t: TagType) => t.id === tag.id)
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={async () => {
                      if (isSelected) {
                        await removeTagFromNote(note.id, tag.id)
                      } else {
                        await addTagToNote(note.id, tag.id)
                      }
                    }}
                  >
                    {tag.name}
                  </Badge>
                )
              })}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTagDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
