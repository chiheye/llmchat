import { exec as execCallback } from "child_process"
import { promisify } from "util"
import initDatabase from "../lib/db/init-db.js"

const exec = promisify(execCallback)

async function migrateDatabase() {
  try {
    console.log("🔄 Running Prisma migrations...")

    // 运行Prisma迁移
    await exec("npx prisma migrate dev --name init")

    console.log("✅ Prisma migrations completed")

    // 初始化数据库（创建pgvector扩展等）
    await initDatabase()

    console.log("✅ Database migration and initialization completed successfully")
  } catch (error) {
    console.error("❌ Error during database migration:", error)
    process.exit(1)
  }
}

migrateDatabase()

