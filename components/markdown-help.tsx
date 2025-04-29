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
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Markdown Guide</DialogTitle>
          <DialogDescription>Format your notes with these Markdown shortcuts</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="font-bold text-lg col-span-2">Headings</div>

            <div className="font-mono"># Heading 1</div>
            <div className="text-3xl font-bold">Heading 1</div>

            <div className="font-mono">## Heading 2</div>
            <div className="text-2xl font-bold">Heading 2</div>

            <div className="font-mono">### Heading 3</div>
            <div className="text-xl font-bold">Heading 3</div>

            <div className="font-bold text-lg col-span-2 mt-2">Emphasis</div>

            <div className="font-mono">**Bold**</div>
            <div className="font-bold">Bold</div>

            <div className="font-mono">*Italic*</div>
            <div className="italic">Italic</div>

            <div className="font-mono">~~Strikethrough~~</div>
            <div className="line-through">Strikethrough</div>

            <div className="font-bold text-lg col-span-2 mt-2">Lists</div>

            <div className="font-mono">
              - Unordered list
              <br />- Item 2
            </div>
            <div>
              • Unordered list
              <br />• Item 2
            </div>

            <div className="font-mono">
              1. Numbered list
              <br />
              2. Item 2
            </div>
            <div>
              1. Numbered list
              <br />
              2. Item 2
            </div>

            <div className="font-mono">
              - [x] Task list item (completed)
              <br />- [ ] Task list item (incomplete)
            </div>
            <div>
              <div className="flex items-center">
                <input type="checkbox" checked readOnly className="mr-2" />
                <span>Task list item (completed)</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" readOnly className="mr-2" />
                <span>Task list item (incomplete)</span>
              </div>
            </div>

            <div className="font-bold text-lg col-span-2 mt-2">Other Elements</div>

            <div className="font-mono">[Link](url)</div>
            <div className="text-blue-600 underline">Link</div>

            <div className="font-mono">![Image](url)</div>
            <div>Image (with alt text)</div>

            <div className="font-mono">&gt; Blockquote</div>
            <div className="border-l-4 pl-2 italic">Blockquote</div>

            <div className="font-mono">---</div>
            <div>Horizontal rule</div>

            <div className="font-mono">`Inline code`</div>
            <div>
              <code className="bg-muted px-1 py-0.5 rounded">Inline code</code>
            </div>

            <div className="font-mono">
              \`\`\`
              <br />
              Code block
              <br />
              \`\`\`
            </div>
            <div className="bg-muted px-2 py-1 rounded text-xs">Code block</div>

            <div className="font-bold text-lg col-span-2 mt-2">Tables</div>

            <div className="font-mono col-span-2 text-xs">
              | Header 1 | Header 2 |<br />| -------- | -------- |<br />| Cell 1 | Cell 2 |
            </div>

            <div className="col-span-2 text-xs">
              <table className="border-collapse w-full">
                <thead>
                  <tr>
                    <th className="border border-muted p-1">Header 1</th>
                    <th className="border border-muted p-1">Header 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-muted p-1">Cell 1</td>
                    <td className="border border-muted p-1">Cell 2</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="font-bold text-lg col-span-2 mt-2">Extended Syntax</div>

            <div className="font-mono">:joy:</div>
            <div>😂 (Emoji)</div>

            <div className="font-mono">==Highlighted text==</div>
            <div>
              <mark className="bg-yellow-200 dark:bg-yellow-800">Highlighted text</mark>
            </div>

            <div className="font-mono">H~2~O</div>
            <div>
              H<sub>2</sub>O (Subscript)
            </div>

            <div className="font-mono">X^2^</div>
            <div>
              X<sup>2</sup> (Superscript)
            </div>

            <div className="font-mono">
              Here's a footnote[^1]
              <br />
              <br />
              [^1]: This is the footnote.
            </div>
            <div>
              Here's a footnote<sup>1</sup>
              <br />
              <br />
              <small>
                <sup>1</sup> This is the footnote.
              </small>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
