"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ChatSidebar } from "@/components/chat/chat-sidebar"

export default function ChatPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  // 将 params.id 存储在本地变量中
  const chatId = params.id

  const [chatTitle, setChatTitle] = useState("新对话")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    // 如果不是新聊天，获取聊天详情
    if (chatId !== "new") {
      // 获取聊天详情
      const fetchChatDetails = async () => {
        try {
          const response = await fetch(`/api/chat/history?chatId=${chatId}`)
          if (response.ok) {
            const data = await response.json()
            setChatTitle(data.title)
          }
        } catch (error) {
          console.error("获取聊天详情失败:", error)
        }
      }
      
      fetchChatDetails()
    }
  }, [user, loading, router, chatId])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <div className="flex h-[calc(100vh-2rem)] flex-col">
        <DashboardHeader heading={chatTitle} />
        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar className="hidden md:block" />
          <div className="flex-1 overflow-auto">
            <ChatInterface chatId={chatId} />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

