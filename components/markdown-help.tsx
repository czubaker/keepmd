import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function MarkdownHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Markdown Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Markdown Cheatsheet</DialogTitle>
          <DialogDescription>You can use Markdown syntax to format your notes.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-mono"># Heading 1</div>
            <div className="text-2xl font-bold">Heading 1</div>

            <div className="font-mono">## Heading 2</div>
            <div className="text-xl font-bold">Heading 2</div>

            <div className="font-mono">### Heading 3</div>
            <div className="text-lg font-bold">Heading 3</div>

            <div className="font-mono">**Bold**</div>
            <div className="font-bold">Bold</div>

            <div className="font-mono">*Italic*</div>
            <div className="italic">Italic</div>

            <div className="font-mono">[Link](url)</div>
            <div className="text-blue-600 underline">Link</div>

            <div className="font-mono">- List item</div>
            <div>• List item</div>

            <div className="font-mono">1. Numbered item</div>
            <div>1. Numbered item</div>

            <div className="font-mono">&gt; Quote</div>
            <div className="border-l-4 pl-2 italic">Quote</div>

            <div className="font-mono">`Code`</div>
            <div>
              <code className="bg-muted px-1 py-0.5 rounded">Code</code>
            </div>

            <div className="font-mono">---</div>
            <div>Horizontal rule</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
