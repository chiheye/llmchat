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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Trash } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmbeddingModelSelector } from "@/components/knowledge-base/embedding-model-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for knowledge bases
const mockKnowledgeBases = [
  {
    id: "1",
    name: "Product Documentation",
    description: "Documentation for our product features and APIs",
    embeddingModel: "text-embedding-ada-002",
    chunkSize: "1000",
    chunkOverlap: "200",
    isPublic: false,
  },
  {
    id: "2",
    name: "Company Policies",
    description: "Internal company policies and procedures",
    embeddingModel: "text-embedding-3-small",
    chunkSize: "800",
    chunkOverlap: "150",
    isPublic: false,
  },
  {
    id: "3",
    name: "Research Papers",
    description: "Collection of AI research papers",
    embeddingModel: "text-embedding-3-large",
    chunkSize: "1200",
    chunkOverlap: "300",
    isPublic: true,
  },
]

export default function EditKnowledgeBasePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [knowledgeBase, setKnowledgeBase] = useState<any>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [embeddingModel, setEmbeddingModel] = useState("")
  const [chunkSize, setChunkSize] = useState("")
  const [chunkOverlap, setChunkOverlap] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    // Fetch knowledge base data
    const fetchKnowledgeBase = async () => {
      // In a real app, you would fetch from your API
      const foundKB = mockKnowledgeBases.find((kb) => kb.id === params.id)
      if (foundKB) {
        setKnowledgeBase(foundKB)
        setName(foundKB.name)
        setDescription(foundKB.description)
        setEmbeddingModel(foundKB.embeddingModel)
        setChunkSize(foundKB.chunkSize)
        setChunkOverlap(foundKB.chunkOverlap)
        setIsPublic(foundKB.isPublic)
      } else {
        setError("Knowledge base not found")
      }
    }

    fetchKnowledgeBase()
  }, [params.id, user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // In a real app, you would make an API call to update the knowledge base
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/dashboard/knowledge-bases")
    } catch (err) {
      setError("Failed to update knowledge base. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to delete the knowledge base
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/dashboard/knowledge-bases")
    } catch (err) {
      setError("Failed to delete knowledge base. Please try again.")
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading || !knowledgeBase) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Edit Knowledge Base: ${knowledgeBase.name}`}
        text="Update your knowledge base configuration."
      />
      <div className="grid gap-4">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Knowledge Base Details</CardTitle>
              <CardDescription>Update the details of your knowledge base.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="embedding">Embedding</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Product Documentation, Company Policies, etc."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="A brief description of this knowledge base..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-public"
                      checked={isPublic}
                      onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                    />
                    <Label htmlFor="is-public">Make this knowledge base public</Label>
                  </div>
                </TabsContent>

                <TabsContent value="embedding" className="space-y-4 pt-4">
                  <EmbeddingModelSelector value={embeddingModel} onValueChange={setEmbeddingModel} />
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 text-sm font-medium">About this model</h4>
                    <p className="text-sm text-muted-foreground">
                      {embeddingModel === "text-embedding-ada-002" &&
                        "OpenAI's text-embedding-ada-002 is a general-purpose model with good performance across many tasks. It creates 1536-dimensional embeddings."}
                      {embeddingModel === "text-embedding-3-small" &&
                        "OpenAI's text-embedding-3-small is a smaller, faster model with good performance for most use cases. It creates 1536-dimensional embeddings."}
                      {embeddingModel === "text-embedding-3-large" &&
                        "OpenAI's text-embedding-3-large is their most powerful embedding model, offering the highest accuracy. It creates 3072-dimensional embeddings."}
                      {embeddingModel === "claude-3-embedding" &&
                        "Anthropic's Claude 3 Embedding model provides high-quality embeddings optimized for semantic search and retrieval."}
                      {embeddingModel === "e5-large-v2" &&
                        "E5-large-v2 is an open-source embedding model that performs well on retrieval tasks while being more cost-effective."}
                      {embeddingModel === "bge-large-en-v1.5" &&
                        "BGE-large-en-v1.5 is an open-source embedding model optimized for retrieval tasks in English."}
                      {embeddingModel === "custom" &&
                        "Use your own custom embedding model by providing the API endpoint and configuration."}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chunk-size">Chunk Size (tokens)</Label>
                      <Input
                        id="chunk-size"
                        type="number"
                        value={chunkSize}
                        onChange={(e) => setChunkSize(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        The size of text chunks for processing. Smaller chunks are more precise, larger chunks provide
                        more context.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chunk-overlap">Chunk Overlap (tokens)</Label>
                      <Input
                        id="chunk-overlap"
                        type="number"
                        value={chunkOverlap}
                        onChange={(e) => setChunkOverlap(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        The amount of overlap between chunks to maintain context across chunk boundaries.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/knowledge-bases")}>
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
                      <DialogTitle>Delete Knowledge Base</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this knowledge base? This action cannot be undone.
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

