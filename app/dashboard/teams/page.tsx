"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TeamsPage() {
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
      <DashboardHeader heading="Teams" text="Manage your teams and team members.">
        <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]">
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </DashboardHeader>

      <div className="grid gap-4">
        <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
          <CardHeader>
            <CardTitle className="text-white">Your Teams</CardTitle>
            <CardDescription className="text-blue-200">Teams you've created or are a member of.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-blue-500/30 overflow-hidden">
              <Table>
                <TableHeader className="bg-blue-900/50">
                  <TableRow className="hover:bg-blue-800/50 border-blue-500/30">
                    <TableHead className="text-blue-100">Team</TableHead>
                    <TableHead className="text-blue-100">Role</TableHead>
                    <TableHead className="text-blue-100">Members</TableHead>
                    <TableHead className="text-blue-100">Knowledge Bases</TableHead>
                    <TableHead className="text-right text-blue-100">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id} className="hover:bg-blue-800/30 border-blue-500/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/50">
                            <Users className="h-5 w-5 text-blue-300" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{team.name}</div>
                            <div className="text-sm text-blue-300">{team.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={team.role === "Owner" ? "default" : "outline"}
                          className={
                            team.role === "Owner"
                              ? "bg-blue-600 hover:bg-blue-500 text-white"
                              : "bg-blue-900/30 text-blue-200 border-blue-500/30"
                          }
                        >
                          {team.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {team.members.map((member, i) => (
                            <Avatar key={i} className="h-8 w-8 border-2 border-blue-950">
                              <AvatarFallback className="bg-blue-900 text-blue-200">{member.initials}</AvatarFallback>
                              <AvatarImage src={member.avatar} alt={member.name} />
                            </Avatar>
                          ))}
                          {team.members.length > 3 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-950 bg-blue-900/50 text-xs font-medium text-blue-200">
                              +{team.members.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-blue-100">{team.knowledgeBases}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-200 hover:bg-blue-800/40 hover:text-white"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-blue-950 border-blue-500/30 text-white">
                            <DropdownMenuItem className="focus:bg-blue-800 focus:text-white">
                              View Team
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-blue-800 focus:text-white">
                              Manage Members
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-blue-800 focus:text-white">
                              Team Settings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

const teams = [
  {
    id: "1",
    name: "Product Team",
    description: "Product development and management",
    role: "Owner",
    members: [
      { name: "John Doe", initials: "JD", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Jane Smith", initials: "JS", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Bob Johnson", initials: "BJ", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Alice Williams", initials: "AW", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    knowledgeBases: 3,
  },
  {
    id: "2",
    name: "Marketing Team",
    description: "Marketing and communications",
    role: "Member",
    members: [
      { name: "Sarah Parker", initials: "SP", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Tom Wilson", initials: "TW", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Emily Davis", initials: "ED", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    knowledgeBases: 2,
  },
  {
    id: "3",
    name: "Research Group",
    description: "AI and ML research",
    role: "Admin",
    members: [
      { name: "David Lee", initials: "DL", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Lisa Chen", initials: "LC", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Michael Brown", initials: "MB", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Karen White", initials: "KW", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "James Taylor", initials: "JT", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    knowledgeBases: 5,
  },
]

