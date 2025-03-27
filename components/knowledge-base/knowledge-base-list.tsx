import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Database, FileText, MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
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

export function KnowledgeBaseList() {
  const router = useRouter();
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [kbToDelete, setKbToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 加载知识库列表
  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/knowledge-base/list');
        
        if (!response.ok) {
          throw new Error('Failed to fetch knowledge bases');
        }
        
        const data = await response.json();
        setKnowledgeBases(data.knowledgeBases || []);
      } catch (error) {
        console.error('Error loading knowledge bases:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchKnowledgeBases();
  }, []);
  
  // 处理删除知识库
  const handleDeleteKnowledgeBase = async () => {
    if (!kbToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/knowledge-base/delete?id=${kbToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete knowledge base');
      }

      // 删除成功后更新列表（实际项目中应该重新获取列表）
      setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== kbToDelete));
      
    } catch (error) {
      console.error('Error deleting knowledge base:', error);
      // 这里可以添加错误提示
    } finally {
      setIsDeleting(false);
      setKbToDelete(null);
    }
  };

  // 处理查看知识库
  const handleViewKnowledgeBase = (id: string) => {
    router.push(`/dashboard/knowledge-bases/${id}`);
  };

  // 处理编辑知识库
  const handleEditKnowledgeBase = (id: string) => {
    router.push(`/dashboard/knowledge-bases/${id}/edit`);
  };

  return (
    <Card className="border-blue-500/30 bg-blue-950/40 backdrop-blur-sm text-white">
      <CardHeader>
        <CardTitle className="text-white">Your Knowledge Bases</CardTitle>
        <CardDescription className="text-blue-200">
          A list of all your knowledge bases and their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : knowledgeBases.length === 0 ? (
          <div className="text-center py-8 text-blue-300/70">
            <p>No knowledge bases found</p>
            <p className="text-sm mt-1">Create your first knowledge base to get started</p>
          </div>
        ) : (
          <div className="rounded-md border border-blue-500/30 overflow-hidden">
            <Table>
              <TableHeader className="bg-blue-900/50">
                <TableRow className="hover:bg-blue-800/50 border-blue-500/30">
                  <TableHead className="text-blue-100">Name</TableHead>
                  <TableHead className="text-blue-100">Documents</TableHead>
                  <TableHead className="text-blue-100">Embedding Model</TableHead>
                  <TableHead className="text-blue-100">Last Updated</TableHead>
                  <TableHead className="text-blue-100">Created By</TableHead>
                  <TableHead className="text-right text-blue-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {knowledgeBases.map((kb) => (
                  <TableRow key={kb.id} className="hover:bg-blue-800/30 border-blue-500/30">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-blue-300" />
                        <span>{kb.name}</span>
                        {kb.isPublic && (
                          <Badge variant="outline" className="ml-2 bg-blue-900/30 text-blue-200 border-blue-500/30">
                            Public
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-100">{kb.documents}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs bg-blue-900/30 text-blue-200 border-blue-500/30"
                      >
                        {kb.embeddingModel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-blue-100">{kb.updated}</TableCell>
                    <TableCell className="text-blue-100">{kb.createdBy}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-200 hover:bg-blue-800/40 hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-blue-950 border-blue-500/30 text-white">
                          <DropdownMenuItem 
                            className="focus:bg-blue-800 focus:text-white cursor-pointer"
                            onClick={() => handleViewKnowledgeBase(kb.id)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-blue-800 focus:text-white cursor-pointer"
                            onClick={() => handleEditKnowledgeBase(kb.id)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-400 focus:bg-red-900/50 focus:text-red-200 cursor-pointer"
                            onClick={() => setKbToDelete(kb.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!kbToDelete} onOpenChange={(open) => !open && setKbToDelete(null)}>
        <AlertDialogContent className="bg-blue-950 border border-blue-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription className="text-blue-300">
              您确定要删除这个知识库吗？此操作将删除所有相关文档和嵌入，且无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-blue-900/50 text-white border-blue-500/30 hover:bg-blue-800/50">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteKnowledgeBase}
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
    </Card>
  );
}

