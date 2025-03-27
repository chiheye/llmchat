"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface KnowledgeBaseSelectorProps {
  value: string | null
  onValueChange: (value: string | null) => void
}

export function KnowledgeBaseSelector({ value, onValueChange }: KnowledgeBaseSelectorProps) {
  return (
    <Select value={value || ""} onValueChange={(val) => onValueChange(val || null)}>
      <SelectTrigger className="w-[220px] bg-blue-950/40 border-blue-500/30 text-blue-100 hover:bg-blue-900/50 hover:border-blue-400/40 focus:ring-blue-400/30">
        <SelectValue placeholder="Select a knowledge base" />
      </SelectTrigger>
      <SelectContent className="bg-blue-950 border-blue-500/30 text-white">
        <SelectItem value="none" className="focus:bg-blue-800 focus:text-white">
          No knowledge base
        </SelectItem>
        <SelectItem value="1" className="focus:bg-blue-800 focus:text-white">
          Product Documentation
        </SelectItem>
        <SelectItem value="2" className="focus:bg-blue-800 focus:text-white">
          Company Policies
        </SelectItem>
        <SelectItem value="3" className="focus:bg-blue-800 focus:text-white">
          Research Papers
        </SelectItem>
        <SelectItem value="4" className="focus:bg-blue-800 focus:text-white">
          Customer Support
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

