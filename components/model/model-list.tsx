"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, Cpu, MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Model {
  id: string
  name: string
  provider: string
  apiUrl: string
  isDefault: boolean
}

export function ModelList() {
  const [models, setModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models")
        if (!response.ok) {
          throw new Error("Failed to fetch models")
        }
        const data = await response.json()
        setModels(data)
      } catch (err) {
        setError("Failed to load models. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/models/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete model")
      }

      setModels(models.filter((model) => model.id !== id))
    } catch (err) {
      setError("Failed to delete model. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Models</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-blue-500/30 overflow-hidden">
          <Table>
            <TableHeader className="bg-blue-900/50">
              <TableRow className="hover:bg-blue-800/50 border-blue-500/30">
                <TableHead className="text-blue-100">Name</TableHead>
                <TableHead className="text-blue-100">Provider</TableHead>
                <TableHead className="text-blue-100">API URL</TableHead>
                <TableHead className="text-blue-100">Default</TableHead>
                <TableHead className="text-right text-blue-100">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id} className="hover:bg-blue-800/30 border-blue-500/30">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-blue-900/50 p-2">
                        <Cpu className="h-4 w-4 text-blue-300" />
                      </div>
                      <span>{model.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-100">{model.provider}</TableCell>
                  <TableCell className="font-mono text-xs text-blue-200">{model.apiUrl}</TableCell>
                  <TableCell>
                    {model.isDefault && (
                      <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-500/30">
                        <Check className="mr-1 h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </TableCell>
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
                        <Link href={`/dashboard/models/${model.id}/edit`}>
                          <DropdownMenuItem className="focus:bg-blue-800 focus:text-white">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-red-400 focus:bg-red-900/50 focus:text-red-200"
                          onClick={() => handleDelete(model.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
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
  )
}

