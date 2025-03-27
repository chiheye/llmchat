"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmbeddingModelSelector } from "@/components/knowledge-base/embedding-model-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewKnowledgeBasePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-ada-002")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [chunkSize, setChunkSize] = useState("1000")
  const [chunkOverlap, setChunkOverlap] = useState("200")
  const [isPublic, setIsPublic] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // In a real app, you would make an API call to your backend
      // For now, we'll just simulate a successful knowledge base creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/dashboard/knowledge-bases")
    } catch (err) {
      setError("Failed to create knowledge base. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create Knowledge Base"
        text="Create a new knowledge base for AI-enhanced conversations."
      />
      <div className="grid gap-4">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Knowledge Base Details</CardTitle>
              <CardDescription>Enter the details of the knowledge base you want to create.</CardDescription>
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
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/knowledge-bases")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Knowledge Base"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardShell>
  )
}

