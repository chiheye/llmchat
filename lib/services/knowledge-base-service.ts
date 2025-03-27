import type { KnowledgeBase, Document, DocumentChunk } from "@prisma/client"
import { prisma } from "../db/prisma"
import { chunkDocument, createEmbedding, storeDocumentChunks } from "../db/vector-operations"

export async function createKnowledgeBase(data: {
  name: string
  description?: string
  embeddingModel: string
  chunkSize?: number
  chunkOverlap?: number
  isPublic?: boolean
  ownerId: string
  teamId?: string
}): Promise<KnowledgeBase> {
  return prisma.knowledgeBase.create({
    data,
  })
}

export async function getKnowledgeBase(id: string): Promise<KnowledgeBase | null> {
  return prisma.knowledgeBase.findUnique({
    where: { id },
    include: {
      documents: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: true,
    },
  })
}

export async function getUserKnowledgeBases(userId: string): Promise<KnowledgeBase[]> {
  return prisma.knowledgeBase.findMany({
    where: {
      OR: [{ ownerId: userId }, { team: { members: { some: { userId } } } }],
    },
    include: {
      _count: {
        select: { documents: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  })
}

export async function addDocumentToKnowledgeBase(
  knowledgeBaseId: string,
  fileData: {
    filename: string
    mimeType: string
    size: number
    content: string
  },
): Promise<Document> {
  // 1. 获取知识库配置
  const knowledgeBase = await prisma.knowledgeBase.findUnique({
    where: { id: knowledgeBaseId },
  })

  if (!knowledgeBase) {
    throw new Error(`Knowledge base with ID ${knowledgeBaseId} not found`)
  }

  // 2. 创建文档记录
  const document = await prisma.document.create({
    data: {
      filename: fileData.filename,
      mimeType: fileData.mimeType,
      size: fileData.size,
      content: fileData.content,
      knowledgeBaseId,
    },
  })

  // 3. 将文档分块
  const chunks = chunkDocument(fileData.content, knowledgeBase.chunkSize, knowledgeBase.chunkOverlap)

  // 4. 为每个块创建嵌入并存储
  const metadata = {
    filename: fileData.filename,
    mimeType: fileData.mimeType,
  }

  await storeDocumentChunks(document.id, chunks, metadata)

  return document
}

export async function searchKnowledgeBase(
  knowledgeBaseId: string,
  query: string,
  limit = 5,
): Promise<{ chunks: DocumentChunk[]; documents: Document[] }> {
  // 1. 获取知识库
  const knowledgeBase = await prisma.knowledgeBase.findUnique({
    where: { id: knowledgeBaseId },
  })

  if (!knowledgeBase) {
    throw new Error(`Knowledge base with ID ${knowledgeBaseId} not found`)
  }

  // 2. 创建查询嵌入
  const queryEmbedding = await createEmbedding(query)

  // 3. 使用余弦相似度搜索最相似的文档块
  const chunks = (await prisma.$queryRaw`
    SELECT 
      "DocumentChunk".*, 
      1 - (embedding <=> ${queryEmbedding}::vector) as similarity
    FROM "DocumentChunk"
    JOIN "Document" ON "DocumentChunk"."documentId" = "Document"."id"
    WHERE "Document"."knowledgeBaseId" = ${knowledgeBaseId}
    ORDER BY similarity DESC
    LIMIT ${limit}
  `) as (DocumentChunk & { similarity: number })[]

  // 4. 获取相关文档的完整信息
  const documentIds = [...new Set(chunks.map((chunk) => chunk.documentId))]
  const documents = await prisma.document.findMany({
    where: {
      id: { in: documentIds },
    },
  })

  return { chunks, documents }
}

