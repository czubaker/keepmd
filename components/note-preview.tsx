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
      <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline">
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
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji, remarkSupersub]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
