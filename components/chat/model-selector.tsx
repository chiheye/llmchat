"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Model {
  id: string
  name: string
  provider: string
  apiUrl: string
  isDefault: boolean
}

interface ModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models")
        if (!response.ok) {
          throw new Error("Failed to fetch models")
        }
        const data = await response.json()
        setModels(data)
      } catch (error) {
        console.error("Error fetching models:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])

  if (isLoading) {
    return (
      <Select value={value} onValueChange={onValueChange} disabled>
        <SelectTrigger className="w-[180px] bg-blue-950/40 border-blue-500/30 text-blue-100 hover:bg-blue-900/50 hover:border-blue-400/40 focus:ring-blue-400/30">
          <SelectValue placeholder="Loading models..." />
        </SelectTrigger>
        <SelectContent className="bg-blue-950 border-blue-500/30 text-white">
          <SelectItem value="loading" disabled>
            Loading...
          </SelectItem>
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] bg-blue-950/40 border-blue-500/30 text-blue-100 hover:bg-blue-900/50 hover:border-blue-400/40 focus:ring-blue-400/30">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent className="bg-blue-950 border-blue-500/30 text-white">
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id} className="focus:bg-blue-800 focus:text-white">
            {model.name} {model.isDefault && "(Default)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

