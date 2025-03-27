import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const knowledgeBaseId = searchParams.get("id");

    if (!knowledgeBaseId) {
      return NextResponse.json({ error: "Knowledge Base ID is required" }, { status: 400 });
    }

    // 查找知识库，确保它属于当前用户
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id: knowledgeBaseId },
      select: { userId: true } // 使用 userId 而不是 ownerId
    });

    if (!knowledgeBase) {
      return NextResponse.json({ error: "Knowledge Base not found" }, { status: 404 });
    }

    // 验证所有权
    if (knowledgeBase.userId !== session.user.id) { // 使用 userId 而不是 ownerId
      return new Response("Unauthorized", { status: 401 });
    }

    // 删除知识库（级联删除相关文档）
    await prisma.knowledgeBase.delete({
      where: { id: knowledgeBaseId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting knowledge base:", error);
    return NextResponse.json(
      { error: "Failed to delete knowledge base" },
      { status: 500 }
    );
  }
}