import type { ComponentPropsWithoutRef } from "react"
import ReactMarkdown from "react-markdown"

import { cn } from "~/lib/utils"

type MarkdownProps = ComponentPropsWithoutRef<typeof ReactMarkdown> & {
  className?: string
}

/**
 * Lightweight markdown renderer with sensible defaults for drawers/modals.
 */
export function Markdown({ className, ...props }: MarkdownProps) {
  return (
    <div
      className={cn(
        "space-y-4 text-sm leading-relaxed text-gray-800",
        "[&_code]:rounded-md [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:p-3 [&_pre]:text-gray-100",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:pl-1",
        "[&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_h4]:text-sm",
        className
      )}
    >
      <ReactMarkdown {...props} />
    </div>
  )
}
