import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function initDatabase() {
  try {
    // 创建pgvector扩展（如果尚未创建）
    await prisma.$executeRawUnsafe("CREATE EXTENSION IF NOT EXISTS vector;")

    console.log("✅ pgvector extension created successfully")

    // 可以在这里添加其他初始化操作，如创建索引等

    console.log("✅ Database initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 如果直接运行此脚本，则执行初始化
if (import.meta.url === new URL(import.meta.url).href) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export default initDatabase

