import { OpenAI } from "openai"
import { NextResponse } from "next/server"
import { getChatWithContext, addMessageToChat } from "@/lib/services/chat-service"
import { prisma } from "@/lib/prisma"
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"

interface ChatMessage {
  role: string
  content: string
  parts?: Array<{
    type: string
    text: string
  }>
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      chatId,
      model = "gpt-4",
      knowledgeBaseId,
      showChainOfThought = true,
      parameters = {},
      saveHistory = true, // 添加保存历史的标志
    } = await req.json()

    // 获取模型信息
    const modelData = await prisma.model.findUnique({
      where: { id: model },
    })

    if (!modelData) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    // 获取最后一条消息
    const lastMessage = messages[messages.length - 1].content

    // 存储用户消息
    if (chatId && chatId !== "new") {
      await addMessageToChat(chatId, {
        role: "user",
        content: lastMessage,
      })
    }

    // 获取聊天和相关上下文
    let relevantContext = ""
    if (chatId && chatId !== "new") {
      const { relevantContext: context } = await getChatWithContext(chatId, lastMessage)
      if (context) {
        relevantContext = context
      }
    }

    // 构建系统提示
    let systemPrompt = parameters.systemPrompt || "You are a helpful assistant."

    if (relevantContext) {
      systemPrompt += `\n\nUse the following information from the knowledge base to answer the question:\n${relevantContext}`
    }

    // 添加Chain of Thought指令
    if (showChainOfThought) {
      systemPrompt +=
        "\n\nWhen answering complex questions, show your reasoning step by step before providing the final answer."
    }

    // 创建OpenAI客户端
    const openai = new OpenAI({
      apiKey: modelData.apiKey,
      baseURL: modelData.apiUrl || "http://onlinechat.dynv6.net:5005/v1",
    })

    // 构建消息，清理消息格式
    const requestMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(0, -1).map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: lastMessage }
    ]

    console.log("Sending request to OpenAI with messages:", JSON.stringify(requestMessages, null, 2))

    // 创建流式响应
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // 在后台处理流式响应
    const processStream = async () => {
      try {
        // 应用模型参数生成回复
        const response = await openai.chat.completions.create({
          model: modelData.provider,
          messages: requestMessages,
          stream: true,
          temperature: parameters.temperature || 0.7,
          max_tokens: parameters.maxTokens || 4096,
          top_p: parameters.topP || 1.0,
          frequency_penalty: parameters.frequencyPenalty || 0,
          presence_penalty: parameters.presencePenalty || 0,
          stop: parameters.stopSequences || undefined,
          seed: parameters.seed,
          ...(parameters.useJsonMode && { response_format: { type: "json_object" } }),
        })

        let fullContent = ""
        const stream = response as unknown as AsyncIterable<any>
        
        for await (const chunk of stream) {
          console.log("Received chunk:", JSON.stringify(chunk, null, 2))
          
          // 修改这里：确保返回的数据格式符合 AI SDK 的期望
          if (chunk.choices && chunk.choices[0]) {
            const delta = chunk.choices[0].delta
            if (delta && delta.content) {
              fullContent += delta.content
              // 使用 AI SDK 期望的格式
              await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
            }
          } else if (chunk.data) {
            try {
              const data = JSON.parse(chunk.data)
              if (data.choices && data.choices[0]) {
                const delta = data.choices[0].delta
                if (delta && delta.content) {
                  fullContent += delta.content
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ content: delta.content })}\n\n`))
                }
              }
            } catch (e) {
              console.error("Error parsing chunk data:", e)
            }
          }
        }

        // 存储完整的AI回复
        if (chatId && chatId !== "new") {
          await addMessageToChat(chatId, {
            role: "assistant",
            content: fullContent,
          })
        }

        await writer.write(encoder.encode("data: [DONE]\n\n"))
        await writer.close()
      } catch (error) {
        console.error("Error in stream processing:", error)
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: "Stream processing failed" })}\n\n`))
        await writer.close()
      }
    }

    // 启动流处理
    processStream()

    // 返回流式响应
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error: any) {
    console.error("Error in chat API:", error)
    
    // 更详细的错误处理
    const errorMessage = error.response?.data?.error?.message || error.message || "Failed to generate response"
    const statusCode = error.response?.status || 500
    
    // 记录完整的错误信息
    console.error("Full error details:", {
      message: errorMessage,
      status: statusCode,
      response: error.response?.data,
      stack: error.stack
    })
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error.response?.data || null
    }, { status: statusCode })
  }
}

// 添加GET方法以支持流式响应
export async function GET(req: Request) {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}