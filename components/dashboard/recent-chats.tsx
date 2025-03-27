import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Plus } from "lucide-react"
import Link from "next/link"

interface RecentChatsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentChats({ className, ...props }: RecentChatsProps) {
  return (
    <Card className={cn("border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Recent Chats</CardTitle>
          <CardDescription className="text-blue-200">Your recent conversations with AI models.</CardDescription>
        </div>
        <Link href="/dashboard/chat/new">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          >
            <Plus className="mr-1 h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center justify-between rounded-lg border border-blue-500/30 bg-blue-900/20 p-3"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-blue-900/50 p-2">
                  <MessageSquare className="h-4 w-4 text-blue-300" />
                </div>
                <div>
                  <div className="font-medium text-white">{chat.title}</div>
                  <div className="text-sm text-blue-300">
                    {chat.model} • {chat.date}
                  </div>
                </div>
              </div>
              <Link href={`/dashboard/chat/${chat.id}`}>
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

const recentChats = [
  {
    id: "1",
    title: "Project Planning Discussion",
    model: "GPT-4",
    date: "2 hours ago",
  },
  {
    id: "2",
    title: "Technical Documentation Help",
    model: "Claude",
    date: "1 day ago",
  },
  {
    id: "3",
    title: "Marketing Strategy Brainstorm",
    model: "GPT-4",
    date: "3 days ago",
  },
]

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

