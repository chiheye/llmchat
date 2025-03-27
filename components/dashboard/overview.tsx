import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, MessageSquare, Users, FileText } from "lucide-react"

export function Overview() {
  return (
    <>
      <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Knowledge Bases</CardTitle>
          <div className="rounded-full bg-blue-900/50 p-2">
            <Database className="h-4 w-4 text-blue-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-blue-300">+2 from last month</p>
        </CardContent>
      </Card>
      <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Conversations</CardTitle>
          <div className="rounded-full bg-blue-900/50 p-2">
            <MessageSquare className="h-4 w-4 text-blue-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-blue-300">+12 from last month</p>
        </CardContent>
      </Card>
      <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Team Members</CardTitle>
          <div className="rounded-full bg-blue-900/50 p-2">
            <Users className="h-4 w-4 text-blue-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-blue-300">+1 from last month</p>
        </CardContent>
      </Card>
      <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Documents</CardTitle>
          <div className="rounded-full bg-blue-900/50 p-2">
            <FileText className="h-4 w-4 text-blue-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">42</div>
          <p className="text-xs text-blue-300">+8 from last month</p>
        </CardContent>
      </Card>
    </>
  )
}

