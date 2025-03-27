import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Plus } from "lucide-react"
import Link from "next/link"

interface KnowledgeBasesProps extends React.HTMLAttributes<HTMLDivElement> {}

export function KnowledgeBases({ className, ...props }: KnowledgeBasesProps) {
  return (
    <Card className={cn("border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Knowledge Bases</CardTitle>
          <CardDescription className="text-blue-200">
            Your knowledge repositories for AI-enhanced conversations.
          </CardDescription>
        </div>
        <Link href="/dashboard/knowledge-bases/new">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          >
            <Plus className="mr-1 h-4 w-4" />
            New Knowledge Base
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {knowledgeBases.map((kb) => (
            <div
              key={kb.id}
              className="flex items-center justify-between rounded-lg border border-blue-500/30 bg-blue-900/20 p-3"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-blue-900/50 p-2">
                  <Database className="h-4 w-4 text-blue-300" />
                </div>
                <div>
                  <div className="font-medium text-white">{kb.name}</div>
                  <div className="text-sm text-blue-300">
                    {kb.documents} documents • {kb.updated}
                  </div>
                </div>
              </div>
              <Link href={`/dashboard/knowledge-bases/${kb.id}`}>
                <Button variant="ghost" size="sm" className="text-blue-200 hover:bg-blue-800/40 hover:text-white">
                  View
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const knowledgeBases = [
  {
    id: "1",
    name: "Product Documentation",
    documents: 12,
    updated: "1 day ago",
  },
  {
    id: "2",
    name: "Company Policies",
    documents: 8,
    updated: "3 days ago",
  },
  {
    id: "3",
    name: "Research Papers",
    documents: 24,
    updated: "1 week ago",
  },
  {
    id: "4",
    name: "Customer Support",
    documents: 18,
    updated: "2 weeks ago",
  },
]

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

