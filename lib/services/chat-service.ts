import { prisma } from "@/lib/prisma";
import type { Chat, Message } from "@prisma/client";

export async function createChat(
  userId: string,
  data: {
    title: string;
    modelId: string;
    knowledgeBaseId?: string;
  }
): Promise<Chat> {
  return prisma.chat.create({
    data: {
      title: data.title,
      modelId: data.modelId,
      knowledgeBaseId: data.knowledgeBaseId,
      userId: userId,
    },
  });
}

export async function getChatWithContext(chatId: string): Promise<Chat | null> {
  return prisma.chat.findUnique({
    where: { id: chatId },
  });
}

export async function getChatWithMessages(chatId: string) {
  return prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

export async function addMessageToChat(
  chatId: string,
  data: {
    role: string;
    content: string;
  }
): Promise<Message> {
  // 创建消息
  const message = await prisma.message.create({
    data: {
      role: data.role,
      content: data.content,
      chatId: chatId,
    },
  });

  // 更新聊天的updatedAt字段
  await prisma.chat.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getUserChats(userId: string) {
  return prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  });
}

