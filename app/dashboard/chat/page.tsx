"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Chat" text="Start a new conversation or continue an existing one.">
        <Link href="/dashboard/chat/new">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/chat/new" className="block">
          <Card className="h-full border-dashed border-2 border-blue-500/30 bg-blue-950/30 backdrop-blur-sm hover:border-blue-400 hover:bg-blue-900/30 transition-colors cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              <div className="rounded-full bg-blue-900/50 p-3 mb-3 group-hover:bg-blue-800/70 transition-colors">
                <Plus className="h-8 w-8 text-blue-300 group-hover:text-blue-200" />
              </div>
              <p className="text-lg font-medium text-white">Start a new chat</p>
              <p className="text-sm text-blue-300">Begin a fresh conversation with AI</p>
            </CardContent>
          </Card>
        </Link>

        {recentChats.map((chat) => (
          <Link key={chat.id} href={`/dashboard/chat/${chat.id}`} className="block">
            <Card className="h-full border-blue-500/30 bg-blue-950/40 backdrop-blur-sm hover:border-blue-400 hover:bg-blue-900/50 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-blue-900/50 p-2 mr-3 group-hover:bg-blue-800/70 transition-colors">
                    <MessageSquare className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{chat.title}</h3>
                    <p className="text-sm text-blue-300">
                      {chat.model} • {chat.date}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-blue-200 line-clamp-3">{chat.preview}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardShell>
  )
}

const recentChats = [
  {
    id: "1",
    title: "Project Planning Discussion",
    model: "GPT-4",
    date: "2 hours ago",
    preview:
      "We discussed the timeline for the new product launch and identified key milestones that need to be achieved.",
  },
  {
    id: "2",
    title: "Technical Documentation Help",
    model: "Claude",
    date: "1 day ago",
    preview: "I helped you structure your API documentation and provided examples for each endpoint.",
  },
  {
    id: "3",
    title: "Marketing Strategy Brainstorm",
    model: "GPT-4",
    date: "3 days ago",
    preview: "We explored different marketing channels and created a content calendar for the next quarter.",
  },
  {
    id: "4",
    title: "Code Review Assistance",
    model: "Claude",
    date: "5 days ago",
    preview: "I reviewed your React component structure and suggested improvements for performance optimization.",
  },
  {
    id: "5",
    title: "Research on Vector Databases",
    model: "GPT-4",
    date: "1 week ago",
    preview:
      "We discussed how vector databases work with LLMs and compared different options like Pinecone, Weaviate, and pgvector.",
  },
]

