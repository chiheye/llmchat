import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// 创建一个空的内存存储来临时保存模型数据
// 当 Prisma schema 更新后，可以移除此部分
let mockModels = [];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("Using mock data since prisma.model is undefined");
    
    // 过滤出用户有权访问的模型
    const userModels = mockModels.filter(model => 
      model.isPublic || model.ownerId === session.user.id
    );

    // 返回时隐藏 API 密钥
    const responseModels = userModels.map(model => ({
      ...model,
      apiKey: "***"
    }));

    return NextResponse.json(responseModels);
  } catch (error) {
    console.error("[MODELS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("[MODELS_POST] Request body:", { ...body, apiKey: "***" });
    const { name, provider, apiUrl, apiKey, isDefault, parameters } = body;

    if (!name || !provider || !apiUrl || !apiKey) {
      console.error("[MODELS_POST] Missing required fields:", { name, provider, apiUrl, hasApiKey: !!apiKey });
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 如果设置为默认，取消其他默认模型
    if (isDefault) {
      mockModels = mockModels.map(model => {
        if (model.ownerId === session.user.id && model.isDefault) {
          return { ...model, isDefault: false };
        }
        return model;
      });
    }

    // 处理参数
    let modelParameters = [];
    if (parameters) {
      if (Array.isArray(parameters)) {
        modelParameters = parameters.map((param, index) => ({
          id: `param_${Date.now()}_${index}`,
          name: param.name,
          value: param.value,
          modelId: `model_${Date.now()}`
        }));
      } else {
        // 处理对象形式的参数
        modelParameters = Object.entries(parameters).map(([key, value], index) => ({
          id: `param_${Date.now()}_${index}`,
          name: key,
          value: String(value),
          modelId: `model_${Date.now()}`
        }));
      }
    }

    // 创建新模型
    const newModel = {
      id: `model_${Date.now()}`,
      name,
      provider,
      apiUrl,
      apiKey,
      isDefault: isDefault || false,
      isPublic: false,
      ownerId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      parameters: modelParameters
    };

    // 添加到模拟存储
    mockModels.push(newModel);

    console.log("[MODELS_POST] Model created successfully:", { id: newModel.id, name: newModel.name });
    
    // 返回时隐藏 API 密钥
    const responseModel = { ...newModel, apiKey: "***" };
    return NextResponse.json(responseModel);
  } catch (error) {
    console.error("[MODELS_POST] Unexpected error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}