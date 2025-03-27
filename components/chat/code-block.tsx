import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  language?: string
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const code = React.Children.toArray(children).join('')
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleCopy}
          className="h-8 w-8 p-0 bg-blue-900/50 hover:bg-blue-800/70 text-blue-200"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className={className}>
        {language && (
          <div className="text-xs text-blue-300 bg-blue-900/70 px-3 py-1 rounded-t-md border-b border-blue-500/30">
            {language}
          </div>
        )}
        <code>{children}</code>
      </pre>
    </div>
  )
}