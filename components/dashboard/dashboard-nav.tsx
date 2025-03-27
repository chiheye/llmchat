"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { LayoutDashboard, MessageSquare, Database, Settings, Users, LogOut, Cpu } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Knowledge Bases",
    href: "/dashboard/knowledge-bases",
    icon: Database,
  },
  {
    title: "Models",
    href: "/dashboard/models",
    icon: Cpu,
  },
  {
    title: "Teams",
    href: "/dashboard/teams",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <div className="flex h-full flex-col justify-between py-4">
      <div>
        <div className="px-3 py-2">
          <div className="mb-6 flex items-center px-4">
            <div className="relative w-10 h-10 mr-3">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 bg-blue-500 rounded-full opacity-40"></div>
              <div className="absolute inset-3 bg-blue-600 rounded-full flex items-center justify-center">
                <Cpu className="h-4 w-4 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">LLMChat</h2>
          </div>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-blue-800/60 text-white"
                    : "text-blue-200 hover:bg-blue-800/40 hover:text-white",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="mb-2 px-4 text-xs font-semibold text-blue-300">{user?.name}</div>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start rounded-md px-3 py-2 text-sm font-medium text-blue-200 hover:bg-blue-800/40 hover:text-white"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

