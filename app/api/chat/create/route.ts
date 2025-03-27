import { NextResponse } from "next/server"
import { createChat } from "@/lib/services/chat-service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth-options"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { title, modelId, knowledgeBaseId } = await req.json()
    
    if (!title || !modelId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const chat = await createChat({
      title,
      userId: session.user.id,
      modelId,
      knowledgeBaseId: knowledgeBaseId || undefined,
    })
    
    return NextResponse.json(chat)
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
  }
}