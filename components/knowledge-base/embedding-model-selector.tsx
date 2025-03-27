"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EmbeddingModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function EmbeddingModelSelector({ value, onValueChange }: EmbeddingModelSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="embedding-model">Embedding Model</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Embedding models convert text into vector representations for semantic search. Different models offer
                varying levels of accuracy and performance.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="embedding-model" className="w-full">
          <SelectValue placeholder="Select an embedding model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text-embedding-ada-002">OpenAI - text-embedding-ada-002</SelectItem>
          <SelectItem value="text-embedding-3-small">OpenAI - text-embedding-3-small</SelectItem>
          <SelectItem value="text-embedding-3-large">OpenAI - text-embedding-3-large</SelectItem>
          <SelectItem value="claude-3-embedding">Anthropic - Claude 3 Embedding</SelectItem>
          <SelectItem value="e5-large-v2">E5 - large-v2</SelectItem>
          <SelectItem value="bge-large-en-v1.5">BGE - large-en-v1.5</SelectItem>
          <SelectItem value="custom">Custom Embedding Model</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

