import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    return NextResponse.json({
      status: 'success',
      message: 'API测试成功',
      hasApiKey: !!apiKey,
      // 不暴露API密钥的任何信息
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'API测试失败',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
