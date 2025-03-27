"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChatSidebar({ className }: { className?: string }) {
  const [chats, setChats] = useState<{ id: string; title: string; updatedAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // 添加加载聊天列表的函数
  const loadRecentChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/chat/list', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to load recent chats');
      }

      const data = await response.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Error loading recent chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 在组件挂载时加载聊天列表
  useEffect(() => {
    loadRecentChats();
  }, []);

  // 处理删除聊天记录
  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/chat/delete?chatId=${chatToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      // 删除成功后重新加载聊天列表
      await loadRecentChats();
      
      // 如果当前正在查看被删除的聊天，则重定向到新聊天页面
      const currentPath = window.location.pathname;
      if (currentPath.includes(`/dashboard/chat/${chatToDelete}`)) {
        router.push('/dashboard/chat/new');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setIsDeleting(false);
      setChatToDelete(null);
    }
  };

  return (
    <div className={cn("w-64 border-r border-blue-500/30 bg-blue-950/30 p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Chats</h2>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-blue-500/30 bg-blue-950/50 text-blue-300 hover:bg-blue-900/50 hover:text-white"
          onClick={() => router.push("/dashboard/chat/new")}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-8 text-blue-300/70">
          <p>No recent chats</p>
          <p className="text-sm mt-1">Start a new conversation</p>
        </div>
      ) : (
        <ul className="space-y-1">
          {chats.map((chat) => (
            <li key={chat.id} className="group relative">
              <Link
                href={`/dashboard/chat/${chat.id}`}
                className="flex items-center rounded-md px-3 py-2 text-sm text-blue-200 hover:bg-blue-900/30 hover:text-white"
              >
                <MessageSquare className="mr-2 h-4 w-4 text-blue-400" />
                <span className="truncate">{chat.title}</span>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setChatToDelete(chat.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-sm hover:bg-red-500/20"
                title="删除聊天"
              >
                <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={!!chatToDelete} onOpenChange={(open) => !open && setChatToDelete(null)}>
        <AlertDialogContent className="bg-blue-950 border border-blue-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription className="text-blue-300">
              您确定要删除这个聊天记录吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-blue-900/50 text-white border-blue-500/30 hover:bg-blue-800/50">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChat}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  删除中...
                </>
              ) : (
                "删除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

