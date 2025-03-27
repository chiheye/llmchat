import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserChats } from "@/lib/services/chat-service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chats = await getUserChats(session.user.id);

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chat list:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat list" },
      { status: 500 }
    );
  }
}