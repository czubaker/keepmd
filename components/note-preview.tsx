"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkEmoji from "remark-emoji"
import remarkSupersub from "remark-supersub"

interface NotePreviewProps {
  content: string
}

export function NotePreview({ content }: NotePreviewProps) {
  const [showPreview, setShowPreview] = useState(false)

  if (!content.trim()) {
    return null
  }

  return (
    <div className="mt-2">
      <div className="flex justify-end mb-1">
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? (
            <>
              <EyeOff className="h-3 w-3 mr-1" /> Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" /> Preview
            </>
          )}
        </Button>
      </div>

      {showPreview && (
        <div className="border rounded-md p-3 bg-background/50">
          <div className="prose dark:prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkEmoji, remarkSupersub]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-0 mb-3" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-3 mb-2" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-3 mb-1" {...props} />,
                h5: ({ node, ...props }) => <h5 className="text-base font-bold mt-3 mb-1" {...props} />,
                h6: ({ node, ...props }) => <h6 className="text-sm font-bold mt-3 mb-1" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mt-2 mb-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mt-2 mb-2" {...props} />,
                li: ({ node, className, ...props }) => {
                  if (className?.includes("task-list-item")) {
                    return (
                      <li className="flex items-start mt-1">
                        <input type="checkbox" checked={props.checked} readOnly className="mt-1 mr-2" />
                        <span>{props.children}</span>
                      </li>
                    )
                  }
                  return <li className="mt-1" {...props} />
                },
                p: ({ node, ...props }) => <p className="mt-2 mb-2" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 pl-4 italic my-2" {...props} />,
                code: ({ node, inline, className, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline ? (
                    <pre className={`${match ? `language-${match[1]}` : ""} bg-muted p-2 rounded overflow-x-auto my-2`}>
                      <code className={className} {...props} />
                    </pre>
                  ) : (
                    <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
                  )
                },
                a: ({ node, ...props }) => (
                  <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />
                ),
                img: ({ node, ...props }) => <img className="max-w-full h-auto my-2 rounded" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-4 border-muted" {...props} />,
                table: ({ node, ...props }) => <table className="border-collapse w-full my-2" {...props} />,
                th: ({ node, ...props }) => <th className="border border-muted p-2 bg-muted/50" {...props} />,
                td: ({ node, ...props }) => <td className="border border-muted p-2" {...props} />,
                del: ({ node, ...props }) => <del className="line-through" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                sub: ({ node, ...props }) => <sub {...props} />,
                sup: ({ node, ...props }) => <sup {...props} />,
                mark: ({ node, ...props }) => <mark className="bg-yellow-200 dark:bg-yellow-800" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
