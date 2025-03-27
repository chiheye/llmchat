export const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://username:password@32.tcp.cpolar.top:11446/llmchat?schema=public"

// 验证必要的环境变量
export function validateEnv() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined")
  }
}

