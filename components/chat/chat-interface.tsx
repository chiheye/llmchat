"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"
import type { Message } from "ai"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, GitBranch, Lightbulb } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { ModelSelector } from "./model-selector"
import { KnowledgeBaseSelector } from "./knowledge-base-selector"
import { ModelParameters, type ModelParameters as ModelParametersType } from "./model-parameters"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatInterfaceProps {
  chatId: string
}

// Extended Message type with our custom properties
interface ExtendedMessage extends Message {
  chainOfThought?: {
    steps: { title: string; content: string }[]
    conclusion: string
  }
  visualizations?: {
    svg?: string
    html?: string
    document?: string
  }
}

interface ChatBranch {
  id: string
  name: string
  parentMessageId: string
  messages: ExtendedMessage[]
}

// 替换 useChat 导入
// import { useChat } from 'ai/react'
import { useCustomChatStream } from './custom-stream-handler'

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  // 第一次声明 messages 状态
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // 添加加载聊天历史的函数
  const loadChatHistory = async () => {
    if (chatId === "new") return;
    
    try {
      setIsLoadingHistory(true);
      const response = await fetch(`/api/chat/history?chatId=${chatId}`, {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Failed to load chat history");
      }
      
      const data = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages as ExtendedMessage[]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  // 在组件挂载时加载聊天历史
  useEffect(() => {
    loadChatHistory();
  }, [chatId]);
  
  // 替换 useChat hook 的实现
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  // 添加键盘事件处理函数 - 将函数移到组件内部
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 如果按下Enter键且没有同时按下Shift键
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 阻止默认的换行行为
      
      // 如果输入框不为空，触发表单提交
      if (input.trim()) {
        handleFormSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };
  
  // 处理流式响应部分的修改
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedModel) {
      alert("Please select a model first");
      return;
    }
    
    if (!input.trim()) return;
    
    // 添加用户消息
    const userMessage: ExtendedMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    
    try {
      // 如果是新聊天，先创建聊天记录
      let currentChatId = chatId;
      
      if (chatId === "new") {
        // 创建新聊天
        const createChatResponse = await fetch("/api/chat/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: input.substring(0, 50) + (input.length > 50 ? "..." : ""), // 使用用户输入的前50个字符作为标题
            modelId: selectedModel,
            knowledgeBaseId: selectedKnowledgeBase || undefined
          }),
        });
        
        if (!createChatResponse.ok) {
          throw new Error("Failed to create new chat");
        }
        
        const chatData = await createChatResponse.json();
        currentChatId = chatData.id;
        
        // 可选：重定向到新创建的聊天页面
        window.history.replaceState({}, "", `/dashboard/chat/${currentChatId}`);
      }
      
      // 发送请求
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          chatId: currentChatId,
          model: selectedModel,
          knowledgeBaseId: selectedKnowledgeBase,
          showChainOfThought,
          parameters: modelParameters,
          saveHistory: true, // 添加保存历史的标志
        }),
      });
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      
      // 添加AI消息占位符，添加loading状态
      const aiMessage: ExtendedMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        isLoading: true // 添加loading状态标记
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is null");
      
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = "";
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          
          // 解析SSE格式的数据
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.substring(6);
              if (data === "[DONE]") continue;
              
              try {
                const parsed = JSON.parse(data);
                
                // 处理OpenAI格式的响应
                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                  const newContent = parsed.choices[0].delta.content;
                  accumulatedContent += newContent;
                  
                  // 使用完整的累积内容更新消息，移除loading状态
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    lastMessage.content = accumulatedContent;
                    lastMessage.isLoading = false; // 更新loading状态
                    
                    // 如果有思维链和可视化数据，添加到消息中
                    if (parsed.chainOfThought) {
                      lastMessage.chainOfThought = parsed.chainOfThought;
                    }
                    
                    if (parsed.visualizations) {
                      lastMessage.visualizations = parsed.visualizations;
                    }
                    
                    return newMessages;
                  });
                } else if (parsed.content) {
                  // 处理简单格式的响应
                  const newContent = parsed.content;
                  accumulatedContent += newContent;
                  
                  // 使用完整的累积内容更新消息
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    lastMessage.content = accumulatedContent;
                    lastMessage.isLoading = false; // 更新loading状态
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error("Error parsing chunk:", e, "Raw data:", data);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in chat stream:", error);
      // 错误处理：更新最后一条消息显示错误
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.content = "抱歉，处理您的请求时出现了错误。请重试。";
        lastMessage.isLoading = false;
        lastMessage.isError = true; // 添加错误标记
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string | null>(null)
  const [branches, setBranches] = useState<ChatBranch[]>([])
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null)
  const [showChainOfThought, setShowChainOfThought] = useState(true)
  const [modelParameters, setModelParameters] = useState<ModelParametersType>(getDefaultParameters(selectedModel))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 修改这里：使用不同的变量名，避免重复声明
  // 获取活动消息（来自主对话或分支）
  const activeMessages = activeBranchId
    ? branches.find((b) => b.id === activeBranchId)?.messages || []
    : messages // 使用之前声明的 messages 状态

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeMessages]) // 使用 activeMessages 替代 messages

  // Update model parameters when model changes
  useEffect(() => {
    setModelParameters(getDefaultParameters(selectedModel))
  }, [selectedModel])

  // 删除第二个handleFormSubmit函数，只保留第一个完整实现的版本
  // 删除handleAppendMessage函数，因为它引用了未定义的append函数

  const handleCreateBranch = (messageId: string, branchName: string, mode: "continue" | "new") => {
    const messageIndex = activeMessages.findIndex((m) => m.id === messageId)
    if (messageIndex === -1) return

    // Get messages up to and including the selected message
    const branchMessages = activeMessages.slice(0, messageIndex + 1) as ExtendedMessage[]

    const newBranch: ChatBranch = {
      id: `branch-${Date.now()}`,
      name: branchName,
      parentMessageId: messageId,
      messages: mode === "continue" ? [...branchMessages] : [...branchMessages],
    }

    setBranches([...branches, newBranch])
    setActiveBranchId(newBranch.id)
  }

  // Example Chain of Thought data for demonstration
  const exampleChainOfThought = {
    steps: [
      {
        title: "Understand the Problem",
        content:
          "First, I need to identify what's being asked. The user wants to know how vector databases work with LLMs.",
      },
      {
        title: "Break Down Key Concepts",
        content:
          "Vector databases store embeddings, which are numerical representations of text, images, or other data. LLMs use these embeddings for semantic search and retrieval.",
      },
      {
        title: "Analyze the Relationship",
        content:
          "When an LLM needs to access knowledge, it can query a vector database to find relevant information based on semantic similarity rather than keyword matching.",
      },
      {
        title: "Consider Implementation Details",
        content:
          "This typically involves: \n1. Converting text to embeddings using models like OpenAI's text-embedding-ada-002\n2. Storing these embeddings in a vector database like Pinecone or pgvector\n3. Performing similarity searches when needed",
      },
    ],
    conclusion:
      "Vector databases enhance LLMs by providing efficient storage and retrieval of semantic information, enabling more accurate and contextually relevant responses.",
  }

  // Example visualization data for demonstration
  const exampleVisualizations = {
    svg: `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="50" width="100" height="100" fill="#4F46E5" />
      <circle cx="250" cy="100" r="50" fill="#3B82F6" />
      <text x="200" y="180" fontFamily="Arial" fontSize="16" textAnchor="middle" fill="#1E293B">Vector Database + LLM Architecture</text>
    </svg>`,
    html: `<!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: Arial; max-width: 500px; margin: 0 auto; }
        .box { padding: 20px; margin: 10px 0; border-radius: 5px; }
        .llm { background-color: #EFF6FF; border: 1px solid #BFDBFE; }
        .vector-db { background-color: #F0FDF4; border: 1px solid #BBF7D0; }
        .arrow { text-align: center; font-size: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>LLM + Vector Database Workflow</h2>
        <div class="box llm">
          <h3>LLM (GPT-4)</h3>
          <p>Processes user queries and generates responses</p>
        </div>
        <div class="arrow">↕️</div>
        <div class="box vector-db">
          <h3>Vector Database</h3>
          <p>Stores document embeddings for semantic search</p>
          <ul>
            <li>Efficient similarity search</li>
            <li>Scalable to millions of vectors</li>
            <li>Supports real-time updates</li>
          </ul>
        </div>
      </div>
    </body>
    </html>`,
    document: `<div style="font-family: Arial; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 5px;">
      <h1 style="color: #2563eb;">Vector Databases & LLMs</h1>
      <p style="line-height: 1.6;">Vector databases are specialized database systems designed to store and query high-dimensional vectors efficiently. These vectors are typically embeddings generated from text, images, or other data types.</p>
      <h2 style="color: #4338ca; margin-top: 20px;">Key Benefits</h2>
      <ul style="line-height: 1.6;">
        <li><strong>Semantic Search:</strong> Find similar content based on meaning, not just keywords</li>
        <li><strong>Efficient Retrieval:</strong> Quickly find relevant information from large datasets</li>
        <li><strong>Enhanced Context:</strong> Provide LLMs with relevant information to improve responses</li>
      </ul>
      <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
        <p style="margin: 0;"><em>Vector databases are a critical component in Retrieval Augmented Generation (RAG) systems, which combine the knowledge retrieval capabilities of vector search with the generative abilities of LLMs.</em></p>
      </div>
    </div>`,
  }

  // Add example data to the first AI message for demonstration
  const enhancedMessages = activeMessages.map((msg, index) => {
    if (msg.role === "assistant" && index === 1 && showChainOfThought) {
      return {
        ...msg,
        chainOfThought: exampleChainOfThought,
        visualizations: exampleVisualizations,
      } as ExtendedMessage
    }
    return msg
  })

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white">
      {/* Tech-inspired background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      <div className="flex items-center justify-between border-b border-blue-500/30 p-4 relative z-10">
        <div className="flex items-center space-x-2">
          <ModelSelector value={selectedModel} onValueChange={setSelectedModel} />
          <KnowledgeBaseSelector value={selectedKnowledgeBase} onValueChange={setSelectedKnowledgeBase} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ModelParameters
                    parameters={modelParameters}
                    onParametersChange={setModelParameters}
                    modelId={selectedModel}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-blue-900 text-white border-blue-500/30">
                <p>Model Parameters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          {branches.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-blue-950/40 border-blue-500/30 hover:bg-blue-900/50 hover:border-blue-400/40 text-blue-300"
                >
                  <GitBranch className="h-4 w-4" />
                  {activeBranchId ? branches.find((b) => b.id === activeBranchId)?.name || "Main" : "Main"}
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-blue-800/50 text-blue-200">
                    {branches.length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-blue-950 border-blue-500/30 text-white">
                <DropdownMenuLabel className="text-blue-300">Conversation Branches</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-blue-500/30" />
                <DropdownMenuItem
                  onClick={() => setActiveBranchId(null)}
                  className="focus:bg-blue-800 focus:text-white"
                >
                  Main Conversation
                </DropdownMenuItem>
                {branches.map((branch) => (
                  <DropdownMenuItem
                    key={branch.id}
                    onClick={() => setActiveBranchId(branch.id)}
                    className="focus:bg-blue-800 focus:text-white"
                  >
                    {branch.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-blue-950/40 border-blue-500/30 hover:bg-blue-900/50 hover:border-blue-400/40 text-blue-300"
            onClick={() => setShowChainOfThought(!showChainOfThought)}
          >
            <Lightbulb className="h-4 w-4" />
            {showChainOfThought ? "Hide" : "Show"} Chain of Thought
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        <div className="space-y-4">
          {isLoadingHistory ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-blue-300">加载聊天历史...</p>
              </div>
            </div>
          ) : enhancedMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md text-center backdrop-blur-sm bg-blue-950/30 border border-blue-500/30 rounded-xl p-8 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <h3 className="mb-2 text-xl font-bold text-white">开始新的对话</h3>
                <p className="text-blue-200">向AI提问或开始一段对话。</p>
              </div>
            </div>
          ) : (
            enhancedMessages.map((message) => (
              <ChatMessage key={message.id} message={message} onCreateBranch={handleCreateBranch} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-blue-500/30 p-4 relative z-10">
        <form onSubmit={handleFormSubmit} className="flex items-end space-x-2">
          <div className="relative flex-1">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // 添加键盘事件处理
              rows={1}
              className="min-h-[60px] resize-none pr-12 bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute bottom-2 right-2 text-blue-300 hover:text-white hover:bg-transparent"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          >
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}

// Helper function to get default parameters based on model
function getDefaultParameters(modelId: string): ModelParametersType {
// Default parameters for different models
switch (modelId) {
case "gpt-4":
case "gpt-4o":
return {
temperature: 0.7,
topP: 1.0,
frequencyPenalty: 0.0,
presencePenalty: 0.0,
maxTokens: 4096,
systemPrompt: "You are a helpful assistant.",
stopSequences: [],
responseFormat: "text",
useJsonMode: false,
}
case "claude-3-opus":
case "claude-3-sonnet":
return {
temperature: 0.7,
topP: 0.9,
frequencyPenalty: 0.0,
presencePenalty: 0.0,
maxTokens: 4096,
systemPrompt: "You are Claude, a helpful AI assistant created by Vercel.",
stopSequences: [],
responseFormat: "text",
useJsonMode: false,
}
default:
return {
temperature: 0.7,
topP: 1.0,
frequencyPenalty: 0.0,
presencePenalty: 0.0,
maxTokens: 2048,
systemPrompt: "You are a helpful assistant.",
stopSequences: [],
responseFormat: "text",
useJsonMode: false,
}
}
}

