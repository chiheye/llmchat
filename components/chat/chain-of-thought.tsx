"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  content: string
}

interface ChainOfThoughtProps {
  steps: Step[]
  conclusion: string
}

export function ChainOfThought({ steps, conclusion }: ChainOfThoughtProps) {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])
  const [showAll, setShowAll] = useState(false)

  const toggleStep = (index: number) => {
    if (expandedSteps.includes(index)) {
      setExpandedSteps(expandedSteps.filter((i) => i !== index))
    } else {
      setExpandedSteps([...expandedSteps, index])
    }
  }

  const toggleShowAll = () => {
    if (showAll) {
      setExpandedSteps([])
    } else {
      setExpandedSteps(steps.map((_, i) => i))
    }
    setShowAll(!showAll)
  }

  return (
    <Card className="my-4 overflow-hidden border-blue-500/30 bg-blue-950/30 backdrop-blur-sm">
      <div className="flex items-center justify-between bg-blue-900/50 px-4 py-2">
        <div className="flex items-center gap-2 font-medium text-blue-200">
          <Lightbulb className="h-4 w-4" />
          Chain of Thought
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleShowAll}
          className="h-8 gap-1 text-blue-200 hover:bg-blue-800/50 hover:text-white"
        >
          {showAll ? "Collapse All" : "Expand All"}
          {showAll ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      <CardContent className="p-0">
        <div className="divide-y divide-blue-500/30">
          {steps.map((step, index) => (
            <div key={index} className="border-l-4 border-l-blue-500">
              <button
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-blue-900/30 text-blue-100"
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                    {index + 1}
                  </div>
                  <span className="font-medium">{step.title}</span>
                </div>
                {expandedSteps.includes(index) ? (
                  <ChevronDown className="h-4 w-4 text-blue-300" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-blue-300" />
                )}
              </button>
              <div
                className={cn(
                  "overflow-hidden bg-blue-950/50 px-4 py-3 pl-12 text-sm text-blue-200",
                  expandedSteps.includes(index) ? "block" : "hidden",
                )}
              >
                <div className="whitespace-pre-wrap">{step.content}</div>
              </div>
            </div>
          ))}
          <div className="border-l-4 border-l-green-500 bg-green-900/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-medium text-white">
                ✓
              </div>
              <span className="font-medium text-green-300">Conclusion</span>
            </div>
            <div className="mt-2 whitespace-pre-wrap pl-8 text-green-200">{conclusion}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

