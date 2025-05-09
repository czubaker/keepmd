"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNotesStore } from "@/lib/store"
import { useAuth } from "./auth/auth-context"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import JSZip from "jszip"
import type { Note, Tag } from "@/lib/types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { notes, tags } = useNotesStore()
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagFilterMode, setTagFilterMode] = useState<"all" | "any">("any")

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
    onOpenChange(false)
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const downloadNotes = async (notesToDownload: Note[]) => {
    if (notesToDownload.length === 0) {
      alert("No notes to download")
      return
    }

    // If only one note, download it directly
    if (notesToDownload.length === 1) {
      const note = notesToDownload[0]
      const blob = new Blob([note.content], { type: "text/markdown" })

      // Create a title for the file
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
    } else {
      // For multiple notes, create a zip file
      const zip = new JSZip()
      const folder = zip.folder("notes")

      if (!folder) {
        alert("Failed to create zip folder")
        return
      }

      notesToDownload.forEach((note) => {
        // Create a title for the file
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

        // Add file to zip
        folder.file(filename, note.content)
      })

      // Generate and download the zip
      const content = await zip.generateAsync({ type: "blob" })

      // Create a download link and trigger the download
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = "keepmd-notes.zip"
      document.body.appendChild(a)
      a.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    }
  }

  const handleDownloadAll = () => {
    downloadNotes(notes.filter((note) => !note.is_archived))
  }

  const handleDownloadSelected = () => {
    if (selectedTags.length === 0) {
      alert("Please select at least one tag")
      return
    }

    const filteredNotes = notes.filter((note) => {
      if (note.is_archived) return false

      const noteTags = note.tags || []
      const noteTagIds = noteTags.map((tag) => tag.id)

      if (tagFilterMode === "all") {
        // Note must have ALL selected tags
        return selectedTags.every((tagId) => noteTagIds.includes(tagId))
      } else {
        // Note must have AT LEAST ONE selected tag
        return selectedTags.some((tagId) => noteTagIds.includes(tagId))
      }
    })

    downloadNotes(filteredNotes)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Section */}
          <div>
            <h3 className="text-lg font-medium">Account</h3>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Signed in as</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Download Section */}
          <div>
            <h3 className="text-lg font-medium">Download Notes</h3>
            <div className="mt-2 space-y-4">
              <Button variant="outline" onClick={handleDownloadAll} className="w-full">
                Download All Notes
              </Button>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Download Notes by Tags</h4>

                <RadioGroup
                  value={tagFilterMode}
                  onValueChange={(value) => setTagFilterMode(value as "all" | "any")}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Any selected tag</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All selected tags</Label>
                  </div>
                </RadioGroup>

                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag: Tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleDownloadSelected}
                  disabled={selectedTags.length === 0}
                  className="w-full mt-2"
                >
                  Download Selected
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
