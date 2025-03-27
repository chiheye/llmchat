"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Trash } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Model {
  id: string
  name: string
  provider: string
  apiUrl: string
  apiKey: string
  isDefault: boolean
  parameters: {
    temperature: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
    maxTokens: number
    systemPrompt: string
    stopSequences: string[]
    responseFormat: string
    seed?: number
    useJsonMode: boolean
  }
}

export default function EditModelPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [model, setModel] = useState<Model | null>(null)
  const [name, setName] = useState("")
  const [provider, setProvider] = useState("")
  const [apiUrl, setApiUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [isDefault, setIsDefault] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    // Fetch model data
    const fetchModel = async () => {
      try {
        const response = await fetch(`/api/models/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch model")
        }
        const data = await response.json()
        setModel(data)
        setName(data.name)
        setProvider(data.provider)
        setApiUrl(data.apiUrl)
        setApiKey(data.apiKey)
        setIsDefault(data.isDefault)
      } catch (err) {
        setError("Failed to load model. Please try again.")
      }
    }

    if (user) {
      fetchModel()
    }
  }, [params.id, user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/models/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          provider,
          apiUrl,
          apiKey,
          isDefault,
          parameters: model?.parameters,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update model")
      }

      router.push("/dashboard/models")
    } catch (err) {
      setError("Failed to update model. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/models/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete model")
      }

      router.push("/dashboard/models")
    } catch (err) {
      setError("Failed to delete model. Please try again.")
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading || !model) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={`Edit Model: ${model.name}`} text="Update your AI model configuration." />
      <div className="grid gap-4">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Model Details</CardTitle>
              <CardDescription>Update the details of your AI model.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Model Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., GPT-4, Claude, etc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  placeholder="e.g., OpenAI, Anthropic, etc."
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-url">API URL</Label>
                <Input
                  id="api-url"
                  placeholder="e.g., https://api.openai.com/v1"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-default"
                  checked={isDefault}
                  onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                />
                <Label htmlFor="is-default">Set as default model</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/models")}>
                  Cancel
                </Button>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Model</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this model? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardShell>
  )
}

