// ... 现有代码 ...

// 假设这是处理聊天消息的组件
function ChatWindow() {
  // ... 现有状态和函数 ...

  // 确保有正确的事件监听器来处理接收到的数据块
  useEffect(() => {
    // 建立SSE连接
    const eventSource = new EventSource('/api/chat/stream');
    
    eventSource.onopen = () => {
      console.log("SSE连接已建立");
    };
    
    eventSource.onerror = (error) => {
      console.error("SSE连接错误:", error);
      // 尝试重新连接
      eventSource.close();
    };
    
    eventSource.onmessage = (event) => {
      console.log("收到SSE消息:", event.data);
      
      try {
        // 检查是否是[DONE]标记
        if (event.data === "[DONE]") {
          console.log("流式响应完成");
          return;
        }
        
        const data = JSON.parse(event.data);
        console.log("解析后的数据:", data);
        
        // 处理OpenAI格式的响应
        if (data.choices && data.choices[0]) {
          const choice = data.choices[0];
          
          // 检查是否有delta.content
          if (choice.delta && choice.delta.content !== undefined) {
            setMessages(prev => {
              const newMessages = [...prev];
              // 确保有消息可以更新
              if (newMessages.length === 0) {
                // 如果没有消息，创建一个新的AI消息
                newMessages.push({
                  id: data.id || `msg-${Date.now()}`,
                  role: 'assistant',
                  content: choice.delta.content
                });
              } else {
                // 更新最后一条消息
                const lastMessage = newMessages[newMessages.length - 1];
                // 如果最后一条是用户消息，则添加新的AI消息
                if (lastMessage.role === 'user') {
                  newMessages.push({
                    id: data.id || `msg-${Date.now()}`,
                    role: 'assistant',
                    content: choice.delta.content
                  });
                } else {
                  // 追加内容到现有AI消息
                  lastMessage.content = (lastMessage.content || "") + choice.delta.content;
                }
              }
              return newMessages;
            });
          }
        } else if (data.content) {
          // 处理简单格式的响应
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            // 追加新内容到最后一条消息
            lastMessage.content = (lastMessage.content || "") + data.content;
            return newMessages;
          });
        }
      } catch (error) {
        console.error("解析SSE消息时出错:", error, "原始数据:", event.data);
      }
    };

    return () => {
      console.log("关闭SSE连接");
      eventSource.close();
    };
  }, []);

  // ... 渲染聊天界面的代码 ...
}

// ... 现有代码 ...