import { useState, useEffect } from 'react'
import { Message } from 'ai'

export function useCustomChatStream({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // 添加用户消息
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    
    // 创建AI消息占位符
    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: Message = { id: aiMessageId, role: 'assistant', content: '' }
    setMessages(prev => [...prev, aiMessage])
    
    setIsLoading(true)
    setInput('')
    
    try {
      // 发送请求
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage),
          chatId
        })
      })
      
      if (!response.ok) throw new Error(response.statusText)
      
      // 处理流式响应
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Response body is null')
      
      const decoder = new TextDecoder()
      let done = false
      
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          console.log("Received raw chunk:", chunk)
          
          // 解析SSE格式的数据
          const lines = chunk.split('\n\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6)
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  // 更新AI消息内容
                  setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMessage = newMessages[newMessages.length - 1]
                    if (lastMessage.id === aiMessageId) {
                      lastMessage.content += parsed.content
                    }
                    return newMessages
                  })
                }
              } catch (e) {
                console.error("Error parsing chunk:", e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in chat stream:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return {
    messages,
    input,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
    handleSubmit,
    isLoading
  }
}