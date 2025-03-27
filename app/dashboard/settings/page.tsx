"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, User, Bell, Shield, Key, Upload } from "lucide-react"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

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

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings and preferences." />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-blue-900/30 border border-blue-500/30">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="flex items-center gap-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
          >
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="text-white">Profile</CardTitle>
              <CardDescription className="text-blue-200">Manage your public profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24 border-2 border-blue-500/30 bg-blue-900/50">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
                    <AvatarFallback className="text-blue-200 text-xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-blue-400 text-blue-200 hover:bg-blue-800/20 hover:text-white"
                  >
                    <Upload className="h-4 w-4" />
                    Change Avatar
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-blue-100">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={user.name}
                      className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-blue-100">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio" className="text-blue-100">
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      defaultValue="AI enthusiast and knowledge management specialist"
                      className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-blue-500/30 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="text-white">Notifications</CardTitle>
              <CardDescription className="text-blue-200">Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                <Separator className="bg-blue-500/30" />
                {notificationSettings.map((setting, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{setting.title}</p>
                      <p className="text-sm text-blue-300">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} className="data-[state=checked]:bg-blue-600" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-blue-500/30 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="text-white">Password</CardTitle>
              <CardDescription className="text-blue-200">Change your password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password" className="text-blue-100">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password" className="text-blue-100">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-blue-100">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-blue-500/30 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
              <CardDescription className="text-blue-200">
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-blue-300">Secure your account with 2FA.</p>
                </div>
                <Switch className="data-[state=checked]:bg-blue-600" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-6">
          <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="text-white">API Keys</CardTitle>
              <CardDescription className="text-blue-200">
                Manage your API keys for accessing the LLMChat API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="api-key" className="text-blue-100">
                  Your API Key
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    value="sk_live_••••••••••••••••••••••••••"
                    readOnly
                    className="font-mono bg-blue-950/50 border-blue-500/30 text-white"
                  />
                  <Button
                    variant="outline"
                    className="border-blue-400 text-blue-200 hover:bg-blue-800/20 hover:text-white"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-400 text-blue-200 hover:bg-blue-800/20 hover:text-white"
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="api-usage" className="text-blue-100">
                  API Usage
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger
                    id="api-usage"
                    className="bg-blue-950/50 border-blue-500/30 text-white focus:ring-blue-400/30"
                  >
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-950 border-blue-500/30 text-white">
                    <SelectItem value="all" className="focus:bg-blue-800 focus:text-white">
                      All time
                    </SelectItem>
                    <SelectItem value="30d" className="focus:bg-blue-800 focus:text-white">
                      Last 30 days
                    </SelectItem>
                    <SelectItem value="7d" className="focus:bg-blue-800 focus:text-white">
                      Last 7 days
                    </SelectItem>
                    <SelectItem value="24h" className="focus:bg-blue-800 focus:text-white">
                      Last 24 hours
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-900/20 p-4">
                <div className="text-center">
                  <p className="text-sm text-blue-300">API calls this month</p>
                  <p className="text-3xl font-bold text-white">1,234</p>
                  <p className="text-xs text-blue-300">of 5,000 included in your plan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

const notificationSettings = [
  {
    title: "New chat responses",
    description: "Receive emails when AI responds to your chats",
    enabled: true,
  },
  {
    title: "Knowledge base updates",
    description: "Get notified when your knowledge bases are updated",
    enabled: true,
  },
  {
    title: "Team invitations",
    description: "Receive emails for new team invitations",
    enabled: true,
  },
  {
    title: "Product updates",
    description: "Get notified about new features and improvements",
    enabled: false,
  },
]

