import type React from "react"
import { DashboardNav } from "./dashboard-nav"
import { TechBackground } from "../ui/tech-background"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <TechBackground>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r border-blue-500/30 bg-blue-950/40 backdrop-blur-sm lg:block">
            <DashboardNav />
          </aside>
          <main className="flex-1 p-6 lg:p-8">
            <div className="mx-auto space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </TechBackground>
  )
}

