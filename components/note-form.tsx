"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useNotesStore } from "@/lib/store"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PlusCircle, X } from "lucide-react"
import { useAuth } from "./auth/auth-context"
import { MarkdownHelp } from "./markdown-help"
import { NotePreview } from "./note-preview"

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
  const { addNote } = useNotesStore()
  const { user } = useAuth()

  const handleSubmit = async () => {
    if (content.trim() && user) {
      await addNote({
        user_id: user.id,
        content,
        color: selectedColor,
        is_pinned: false,
        is_archived: false,
      })
      setContent("")
      setSelectedColor(COLORS[0])
      setIsExpanded(false)
    }
  }

  return (
    <Card className={`mb-8 ${selectedColor} border transition-colors duration-200`}>
      <CardContent className="pt-6">
        {isExpanded ? (
          <div className="relative">
            <Textarea
              placeholder="Take a note... (Markdown supported)"
              className="min-h-[100px] resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            />
            <div className="absolute top-2 right-2">
              <MarkdownHelp />
            </div>
            {isExpanded && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <span>Markdown is supported.</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 ml-1 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    return false
                  }}
                >
                  <MarkdownHelp />
                </Button>
              </div>
            )}
            <NotePreview content={content} />
          </div>
        ) : (
          <div className="flex items-center cursor-text p-2" onClick={() => setIsExpanded(true)}>
            <PlusCircle className="mr-2 h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">Take a note...</span>
          </div>
        )}
      </CardContent>

      {isExpanded && (
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`h-8 w-8 rounded-full ${color} border ${color === selectedColor ? "ring-2 ring-primary ring-offset-2" : ""}`}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsExpanded(false)
                setContent("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              Add
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
