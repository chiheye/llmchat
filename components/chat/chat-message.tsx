"use client"

import type { Message } from "ai"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import { BranchControls } from "./branch-controls"
import { ChainOfThought } from "./chain-of-thought"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Code, FileText } from "lucide-react"
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css' // 或选择其他样式

interface ChatMessageProps {
  message: Message & {
    chainOfThought?: {
      steps: { title: string; content: string }[]
      conclusion: string
    }
    visualizations?: {
      svg?: string
      html?: string
      document?: string
    }
    isLoading?: boolean
    isError?: boolean
    createdAt?: Date | string
  }
  onCreateBranch?: (messageId: string, branchName: string, mode: "continue" | "new") => void
}

export function ChatMessage({ message, onCreateBranch }: ChatMessageProps) {
  const [activeTab, setActiveTab] = useState<string>("content")
  const hasVisualizations =
    message.visualizations?.svg || message.visualizations?.html || message.visualizations?.document
  
  // 格式化时间函数
  const formatTime = (dateString?: Date | string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div
      className={`relative rounded-lg p-4 ${
        message.role === "user"
          ? "bg-blue-600/20 border border-blue-500/30"
          : "bg-blue-950/40 border border-blue-500/20"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border text-sm ${
            message.role === "user"
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-blue-950 border-blue-700 text-blue-300"
          }`}
        >
          {message.role === "user" ? "U" : "AI"}
        </div>
        <div className="flex-1 space-y-2">
          {/* 添加时间戳显示 */}
          {message.createdAt && (
            <div className="text-xs text-blue-300/60 mb-1">
              {formatTime(message.createdAt)}
            </div>
          )}
          
          {/* 添加loading状态显示 */}
          {message.isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              <span className="text-blue-300 text-sm ml-2">AI正在思考中...</span>
            </div>
          ) : message.isError ? (
            // 错误状态显示
            <div className="text-red-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {message.content}
            </div>
          ) : (
            // 正常内容显示
            <>
              {/* 现有的标签和内容显示逻辑 */}
              {message.chainOfThought || hasVisualizations ? (
                <div className="space-y-4">
                  <div className="flex border-b border-blue-500/30">
                    <button
                      onClick={() => setActiveTab("content")}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "content"
                          ? "text-blue-300 border-b-2 border-blue-400"
                          : "text-blue-200/70 hover:text-blue-200"
                      }`}
                    >
                      Response
                    </button>
                    {message.chainOfThought && (
                      <button
                        onClick={() => setActiveTab("chainOfThought")}
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "chainOfThought"
                            ? "text-blue-300 border-b-2 border-blue-400"
                            : "text-blue-200/70 hover:text-blue-200"
                        }`}
                      >
                        Chain of Thought
                      </button>
                    )}
                    {hasVisualizations && (
                      <button
                        onClick={() => setActiveTab("visualizations")}
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "visualizations"
                            ? "text-blue-300 border-b-2 border-blue-400"
                            : "text-blue-200/70 hover:text-blue-200"
                        }`}
                      >
                        Visualizations
                      </button>
                    )}
                  </div>
                  
                  {/* 内容显示区域 - 添加淡入动画 */}
                  <div className="transition-opacity duration-300 ease-in-out">
                    {activeTab === "content" && (
                      <div className="prose prose-invert max-w-none prose-blue">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            pre({ node, ...props }) {
                              return <pre {...props} className="overflow-auto rounded-lg bg-blue-950/50 p-4" />
                            },
                            code({ node, inline, className, children, ...props }) {
                              if (inline) {
                                return (
                                  <code
                                    className="rounded bg-blue-950/50 px-1 py-0.5 text-blue-200"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                )
                              }
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              )
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    
                    {/* 其他标签内容显示逻辑保持不变 */}
                    {/* ... 现有代码 ... */}
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none prose-blue">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre({ node, ...props }) {
                        return <pre {...props} className="overflow-auto rounded-lg bg-blue-950/50 p-4" />
                      },
                      code({ node, inline, className, children, ...props }) {
                        if (inline) {
                          return (
                            <code
                              className="rounded bg-blue-950/50 px-1 py-0.5 text-blue-200"
                              {...props}
                            >
                              {children}
                            </code>
                          )
                        }
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* 消息操作按钮 */}
      {message.role === "assistant" && !message.isLoading && !message.isError && (
        <div className="absolute right-4 top-4 flex space-x-2">
          {/* ... 现有代码 ... */}
        </div>
      )}
    </div>
  )
}

