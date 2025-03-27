"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { KnowledgeBaseList } from "@/components/knowledge-base/knowledge-base-list"
import Link from "next/link"

export default function KnowledgeBasesPage() {
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
      <DashboardHeader
        heading="Knowledge Bases"
        text="Manage your knowledge repositories for AI-enhanced conversations."
      >
        <Link href="/dashboard/knowledge-bases/new">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]">
            <Plus className="mr-2 h-4 w-4" />
            New Knowledge Base
          </Button>
        </Link>
      </DashboardHeader>
      <KnowledgeBaseList />
    </DashboardShell>
  )
}

