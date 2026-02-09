// OpenRouter AI 服务模块
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

// 获取 API Key
function getApiKey(): string {
  return import.meta.env.VITE_OPENROUTER_API_KEY || '';
}

// 通用 AI 请求
export async function chat(messages: Message[], useJsonFormat = false): Promise<AIResponse> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return { success: false, error: 'API Key 未配置' };
  }

  try {
    const body: any = {
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'LiveSyncDesk',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `API 错误: ${response.status}` };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    return { success: true, content };
  } catch (error) {
    return { success: false, error: `请求失败: ${error}` };
  }
}

// 生成头脑风暴便签
export async function generateBrainstormNotes(topic: string, count: number = 5): Promise<AIResponse & { notes?: string[] }> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `你是一个创意助手，帮助用户进行头脑风暴。请用简洁的中文回复，每个想法控制在20字以内。只输出想法列表，不要其他内容。格式：每行一个想法，用数字编号。`,
    },
    {
      role: 'user',
      content: `主题：${topic}\n请生成${count}个相关的头脑风暴想法。`,
    },
  ];

  const result = await chat(messages);
  
  if (!result.success || !result.content) {
    return result;
  }

  // 解析返回的内容为数组
  const notes = result.content
    .split('\n')
    .map(line => line.replace(/^\d+[\.\、\)\s]+/, '').trim())
    .filter(line => line.length > 0 && line.length < 50)
    .slice(0, count);

  return { ...result, notes };
}

// 总结画布内容
export async function summarizeContent(contents: string[]): Promise<AIResponse> {
  if (contents.length === 0) {
    return { success: false, error: '没有内容可总结' };
  }

  const messages: Message[] = [
    {
      role: 'system',
      content: '你是一个会议助手，帮助总结和提炼要点。请用简洁的中文，输出3-5个核心要点。',
    },
    {
      role: 'user',
      content: `请总结以下内容的核心要点：\n\n${contents.join('\n\n')}`,
    },
  ];

  return chat(messages);
}

// 扩展想法
export async function expandIdea(idea: string): Promise<AIResponse & { suggestions?: string[] }> {
  const messages: Message[] = [
    {
      role: 'system',
      content: '你是一个创意助手。针对用户的想法，提供3个延伸方向或相关建议。每个建议控制在15字以内，只输出建议列表。',
    },
    {
      role: 'user',
      content: `原始想法：${idea}\n请提供延伸建议。`,
    },
  ];

  const result = await chat(messages);
  
  if (!result.success || !result.content) {
    return result;
  }

  const suggestions = result.content
    .split('\n')
    .map(line => line.replace(/^\d+[\.\、\)\s]+/, '').trim())
    .filter(line => line.length > 0 && line.length < 30)
    .slice(0, 3);

  return { ...result, suggestions };
}
