"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useNotesStore } from "@/lib/store"
import {
  Archive,
  ArchiveRestore,
  Edit,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  Palette,
  Tag,
  Trash2,
  X,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { format } from "date-fns"
import type { Note, Tag as TagType } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "./auth/auth-context"
import remarkGfm from "remark-gfm"
import remarkEmoji from "remark-emoji"
import remarkSupersub from "remark-supersub"
import { MarkdownHelp } from "./markdown-help"
import { useMobile } from "@/hooks/use-mobile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "./language-context"

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
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedColor, setSelectedColor] = useState(note.color)
  const [showPreview, setShowPreview] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false)
  const { user } = useAuth()
  const isMobile = useMobile()
  const noteContentRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset state when note changes
  useEffect(() => {
    setEditContent(note.content)
    setSelectedColor(note.color)
    setHasChanges(false)
  }, [note])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [editContent, isEditing])

  // Reset scroll position when opening a note
  useEffect(() => {
    if (isExpanded && noteContentRef.current) {
      noteContentRef.current.scrollTop = 0
    }
  }, [isExpanded])

  const handleSaveEdit = async () => {
    if (editContent.trim()) {
      await updateNote(note.id, { content: editContent, color: selectedColor })
      setHasChanges(false)
    }
  }

  const handleCloseEditing = () => {
    setIsEditing(false)
    setShowPreview(false)
    if (hasChanges) {
      handleSaveEdit()
    }
  }

  const handleDiscardChanges = () => {
    setEditContent(note.content)
    setSelectedColor(note.color)
    setIsEditing(false)
    setShowPreview(false)
    setHasChanges(false)
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

  const handleDownloadNote = () => {
    // Create a blob with the note content
    const blob = new Blob([note.content], { type: "text/markdown" })

    // Create a title for the file based on the first line or first few characters
    let title = note.content.split("\n")[0].replace(/[#*`]/g, "").trim()
    if (!title || title.length < 3) {
      title = note.content
        .substring(0, 20)
        .replace(/[#*`\n]/g, " ")
        .trim()
    }
    if (!title || title.length < 3) {
      title = `note-${note.id.substring(0, 8)}`
    }

    // Create a safe filename
    const filename = `${title.substring(0, 50).replace(/[/\\?%*:|"<>]/g, "-")}.md`

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  const noteTags = note.tags || []

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

  const handleNoteClick = () => {
    if (!isEditing) {
      setIsExpanded(true)
      setEditContent(note.content)
      setSelectedColor(note.color)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value)
    setHasChanges(e.target.value !== note.content)
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
                    updateNote(note.id, { color })
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
            onClick={() => {
              setSelectedColor(color)
              updateNote(note.id, { color })
            }}
            aria-label={`Select ${color} color`}
          />
        ))}
      </>
    )
  }

  // Define markdown components with proper nesting
  const markdownComponents = {
    // Handle code blocks at the root level to avoid nesting issues
    code: ({ node, inline, className, children }) => {
      const match = /language-(\w+)/.exec(className || "")
      if (!inline) {
        return (
          <div className="my-4">
            <pre className={`${match ? `language-${match[1]}` : ""} bg-muted p-2 rounded overflow-x-auto`}>
              <code className={className}>{children}</code>
            </pre>
          </div>
        )
      }
      return <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>
    },
    p: ({ children }) => <div className="mt-2 mb-2">{children}</div>,
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-0 mb-3">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-4 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-3 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold mt-3 mb-1">{children}</h4>,
    h5: ({ children }) => <h5 className="text-base font-bold mt-3 mb-1">{children}</h5>,
    h6: ({ children }) => <h6 className="text-sm font-bold mt-3 mb-1">{children}</h6>,
    ul: ({ children }) => <ul className="list-disc pl-5 mt-2 mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mt-2 mb-2">{children}</ol>,
    li: ({ children, className, checked }) => {
      if (className?.includes("task-list-item")) {
        return (
          <li className="flex items-start mt-1">
            <input type="checkbox" checked={checked} readOnly className="mt-1 mr-2" />
            <span>{children}</span>
          </li>
        )
      }
      return <li className="mt-1">{children}</li>
    },
    blockquote: ({ children }) => <blockquote className="border-l-4 pl-4 italic my-2">{children}</blockquote>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 dark:text-blue-400 hover.underline">
        {children}
      </a>
    ),
    img: ({ src, alt }) => <img src={src || "/placeholder.svg"} alt={alt} className="max-w-full h-auto my-2 rounded" />,
    hr: () => <hr className="my-4 border-muted" />,
    table: ({ children }) => <table className="border-collapse w-full my-2">{children}</table>,
    th: ({ children }) => <th className="border border-muted p-2 bg-muted/50">{children}</th>,
    td: ({ children }) => <td className="border border-muted p-2">{children}</td>,
    del: ({ children }) => <del className="line-through">{children}</del>,
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    sub: ({ children }) => <sub>{children}</sub>,
    sup: ({ children }) => <sup>{children}</sup>,
    mark: ({ children }) => <mark className="bg-yellow-200 dark:bg-yellow-800">{children}</mark>,
  }

  return (
    <>
      <Card
        className={`${note.color} border transition-colors duration-200 flex flex-col cursor-pointer`}
        onClick={handleNoteClick}
      >
        <CardContent className="pt-6 flex-grow overflow-hidden max-h-[300px]">
          <div className="prose dark:prose-invert prose-sm max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji, remarkSupersub]} components={markdownComponents}>
              {note.content}
            </ReactMarkdown>
          </div>

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
        <CardFooter className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{format(new Date(note.created_at), "dd/MM/yyyy")}</span>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                togglePinned(note.id)
              }}
            >
              {note.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                toggleArchived(note.id)
              }}
            >
              {note.is_archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog
        open={isExpanded}
        onOpenChange={(open) => {
          if (!open && isEditing && hasChanges) {
            handleSaveEdit()
          }
          setIsExpanded(open)
          if (!open) {
            setIsEditing(false)
            setShowPreview(false)
          }
        }}
      >
        <DialogContent className={`${selectedColor} max-w-3xl w-full max-h-[90vh] overflow-hidden p-0`}>
          <div className="flex flex-col h-full">
            {isEditing ? (
              <>
                <div className="p-6 overflow-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
                  <div className={`flex ${showPreview ? "space-x-4" : ""}`}>
                    <div className={`${showPreview ? "w-1/2" : "w-full"}`}>
                      <Textarea
                        ref={textareaRef}
                        value={editContent}
                        onChange={handleContentChange}
                        className="min-h-[200px] h-auto resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                        autoFocus
                      />
                    </div>

                    {showPreview && (
                      <div className="w-1/2 border rounded-md p-3 bg-background/50 overflow-auto">
                        <div className="prose dark:prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkEmoji, remarkSupersub]}
                            components={markdownComponents}
                          >
                            {editContent}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 w-full mt-auto">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setShowPreview(!showPreview)}>
                      {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <MarkdownHelp />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleDiscardChanges}>
                      {t("actions.closeWithoutSaving")}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  ref={noteContentRef}
                  className="p-6 overflow-auto"
                  style={{ maxHeight: "calc(90vh - 80px)" }}
                  onClick={(e) => {
                    // Prevent clicks on links from scrolling the main page
                    if ((e.target as HTMLElement).tagName === "A") {
                      e.stopPropagation()
                    }
                  }}
                >
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkEmoji, remarkSupersub]}
                      components={markdownComponents}
                    >
                      {note.content}
                    </ReactMarkdown>

                    {noteTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-4">
                        {noteTags.map((tag: TagType) => (
                          <Badge key={tag.id} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <div>
                      {t("notes.created")}: {format(new Date(note.created_at), "dd/MM/yyyy HH:mm")}
                    </div>
                    <div>
                      {t("notes.modified")}: {format(new Date(note.updated_at), "dd/MM/yyyy HH:mm")}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 w-full mt-auto">
                  <div className="flex flex-wrap gap-2 items-center">
                    <ColorSelector />
                    <Button variant="ghost" size="icon" onClick={() => setIsTagDialogOpen(true)}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleDownloadNote} title={t("actions.download")}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => togglePinned(note.id)}>
                      {note.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleArchived(note.id)}>
                      {note.is_archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        deleteNote(note.id)
                        setIsExpanded(false)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
            <Button onClick={() => setIsTagDialogOpen(false)}>{t("actions.done")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
