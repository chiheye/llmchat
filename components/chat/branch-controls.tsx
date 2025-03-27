"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GitBranch, GitMerge, MoreHorizontal, Plus } from "lucide-react"

interface BranchControlsProps {
  messageId: string
  onCreateBranch: (messageId: string, branchName: string, mode: "continue" | "new") => void
}

export function BranchControls({ messageId, onCreateBranch }: BranchControlsProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [branchName, setBranchName] = useState("")
  const [branchMode, setBranchMode] = useState<"continue" | "new">("continue")

  const handleCreateBranch = () => {
    if (branchName.trim()) {
      onCreateBranch(messageId, branchName, branchMode)
      setShowDialog(false)
      setBranchName("")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-blue-950/50 border border-blue-500/30 hover:bg-blue-900/50 hover:border-blue-400/40 text-blue-300"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-blue-950 border-blue-500/30 text-white">
          <DropdownMenuItem
            onClick={() => {
              setBranchMode("continue")
              setShowDialog(true)
            }}
            className="focus:bg-blue-800 focus:text-white"
          >
            <GitMerge className="mr-2 h-4 w-4" />
            Continue from here
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setBranchMode("new")
              setShowDialog(true)
            }}
            className="focus:bg-blue-800 focus:text-white"
          >
            <GitBranch className="mr-2 h-4 w-4" />
            New branch from here
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="border-blue-500/30 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
          </div>

          <DialogHeader className="relative z-10">
            <DialogTitle className="text-white">
              {branchMode === "continue" ? "Continue Conversation" : "Create New Branch"}
            </DialogTitle>
            <DialogDescription className="text-blue-200">
              {branchMode === "continue"
                ? "Continue the conversation from this message, preserving context."
                : "Create a new branch starting from this message."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 relative z-10">
            <div className="grid gap-2">
              <Label htmlFor="branch-name" className="text-blue-100">
                Branch Name
              </Label>
              <Input
                id="branch-name"
                placeholder="e.g., Alternative approach"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
              />
            </div>
          </div>
          <DialogFooter className="relative z-10">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-blue-400 text-blue-200 hover:bg-blue-800/20 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBranch}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              {branchMode === "continue" ? "Continue" : "Create Branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

