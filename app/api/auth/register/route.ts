import { NextResponse } from "next/server"
import { createUser } from "@/lib/services/user-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 创建用户
    const user = await createUser({
      name,
      email,
      password,
    })

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    )
  }
} 