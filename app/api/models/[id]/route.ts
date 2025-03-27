import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// 使用空数组作为初始模拟数据，这样用户只会看到自己添加的模型
let mockModels = [];

export async function GET(
  req: Request, 
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const id = context.params.id;
    console.log(`Using mock data for model id: ${id}`);
    
    // 从模拟数据中查找模型
    const model = mockModels.find(m => m.id === id);
    
    if (!model) {
      return new NextResponse("Model not found", { status: 404 });
    }

    // 检查权限
    if (!model.isPublic && model.ownerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 返回时隐藏 API 密钥
    const responseModel = { ...model, apiKey: "***" };
    return NextResponse.json(responseModel);
  } catch (error) {
    console.error("[MODEL_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch model" },
      { status: 500 }
    );
  }
}

// PATCH 和 DELETE 方法也需要类似修改
export async function PATCH(
  req: Request, 
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = context.params.id;
    const body = await req.json();
    console.log("[MODEL_PATCH] Request body:", { ...body, apiKey: body.apiKey ? "***" : undefined });
    
    // 查找模型
    const model = await prisma.model.findUnique({
      where: { id },
    });
    
    if (!model) {
      return new NextResponse("Model not found", { status: 404 });
    }
    
    // 检查权限
    if (model.ownerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // 如果设置为默认，取消其他默认模型
    if (body.isDefault) {
      await prisma.model.updateMany({
        where: {
          ownerId: session.user.id,
          isDefault: true,
          id: { not: id }
        },
        data: {
          isDefault: false,
        },
      });
    }
    
    // 更新模型
    const { parameters, ...modelData } = body;
    
    // 更新模型基本信息
    const updatedModel = await prisma.model.update({
      where: { id },
      data: modelData,
      include: {
        parameters: true,
      },
    });
    
    // 如果提供了参数，更新参数
    if (parameters && Array.isArray(parameters)) {
      // 删除现有参数
      await prisma.modelParameter.deleteMany({
        where: { modelId: id },
      });
      
      // 创建新参数
      for (const param of parameters) {
        await prisma.modelParameter.create({
          data: {
            name: param.name,
            value: param.value,
            modelId: id,
          },
        });
      }
      
      // 重新获取更新后的模型和参数
      const refreshedModel = await prisma.model.findUnique({
        where: { id },
        include: {
          parameters: true,
        },
      });
      
      if (refreshedModel) {
        return NextResponse.json({ ...refreshedModel, apiKey: "***" });
      }
    }
    
    console.log(`Model ${id} updated successfully`);
    
    // 返回时隐藏 API 密钥
    return NextResponse.json({ ...updatedModel, apiKey: "***" });
  } catch (error) {
    console.error("[MODEL_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update model" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request, 
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = context.params.id;
    
    // 查找模型
    const model = await prisma.model.findUnique({
      where: { id },
    });
    
    if (!model) {
      return new NextResponse("Model not found", { status: 404 });
    }
    
    // 检查权限
    if (model.ownerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // 删除模型 (会级联删除相关参数)
    await prisma.model.delete({
      where: { id },
    });
    
    console.log(`Model ${id} deleted successfully`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[MODEL_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete model" },
      { status: 500 }
    );
  }
}