import { PrismaClient } from "@prisma/client"
import OpenAI from "openai"

const prisma = new PrismaClient()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 生成文本嵌入
export async function createEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw error
  }
}

// 将文档分块
export function chunkDocument(text, chunkSize, chunkOverlap) {
  const chunks = []
  let i = 0

  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize)
    chunks.push(chunk)
    i += chunkSize - chunkOverlap
  }

  return chunks
}

// 存储文档块及其嵌入
export async function storeDocumentChunks(documentId, chunks, metadata = {}) {
  const storedChunks = []

  for (const chunkContent of chunks) {
    const embedding = await createEmbedding(chunkContent)

    // 使用Prisma存储文档块和嵌入
    const chunk = await prisma.documentChunk.create({
      data: {
        content: chunkContent,
        metadata,
        embedding: embedding, // pgvector类型
        documentId,
      },
    })

    storedChunks.push(chunk)
  }

  return storedChunks
}

// 基于向量相似度搜索文档块
export async function searchSimilarChunks(query, limit = 5, knowledgeBaseId) {
  const queryEmbedding = await createEmbedding(query)

  // 构建查询条件
  const whereClause = knowledgeBaseId ? { document: { knowledgeBaseId } } : {}

  // 使用余弦相似度搜索最相似的文档块
  const chunks = await prisma.$queryRaw`
    SELECT 
      "DocumentChunk".*, 
      1 - (embedding <=> ${queryEmbedding}::vector) as similarity
    FROM "DocumentChunk"
    JOIN "Document" ON "DocumentChunk"."documentId" = "Document"."id"
    WHERE ${knowledgeBaseId ? prisma.raw(`"Document"."knowledgeBaseId" = '${knowledgeBaseId}'`) : prisma.raw("1=1")}
    ORDER BY similarity DESC
    LIMIT ${limit}
  `

  return chunks
}

