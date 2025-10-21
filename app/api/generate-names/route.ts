import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { englishName, gender, nationality, meanings, style } = body;

    // 构建提示词
    const prompt = buildPrompt(englishName, gender, nationality, meanings, style);
    
    // 调用DeepSeek V3 API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 9c7778cd-c2c1-4679-918e-7852bf602fda'
      },
      body: JSON.stringify({
        model: 'deepseek-v3-1-terminus',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的中文姓名生成专家，精通中国传统文化、诗词文学、五行学说和姓名学。你需要根据用户的需求生成高质量的中文姓名，并提供详细的文化分析。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    // 添加调试日志
    console.log('DeepSeek API响应:', JSON.stringify(data, null, 2));
    console.log('生成的原始内容:', generatedContent);
    
    // 解析生成的姓名数据
    const names = parseGeneratedNames(generatedContent);
    
    return NextResponse.json({ names });
  } catch (error) {
    console.error('生成姓名时出错:', error);
    return NextResponse.json(
      { error: '生成姓名时出现错误，请稍后重试' },
      { status: 500 }
    );
  }
}

function buildPrompt(englishName: string, gender: string, nationality: string, meanings: string[], style: string): string {
  let prompt = `请为以下需求生成5个高质量的中文姓名，并返回JSON格式的详细分析：

用户信息：
- 英文名：${englishName || '未提供'}
- 性别：${gender || '未指定'}
- 国籍：${nationality || '未指定'}
- 期望含义：${meanings.join(', ') || '未指定'}
- 风格偏好：${style || '未指定'}

请生成5个不同的中文姓名，每个姓名需要包含以下信息（请严格按照JSON格式返回）：

{
  "names": [
    {
      "id": 1,
      "chinese": "中文姓名",
      "pinyin": "拼音标注",
      "meaning": "英文含义",
      "explanation": "English detailed explanation including cultural background, symbolism and traditional meaning",
      "characters": [
        {
          "char": "字",
          "meaning": "字义解释",
          "origin": "字源出处",
          "explanation": "English explanation of this character"
        }
      ],
      "culturalScore": 85,
      "style": "风格描述",
      "commonness": "常见程度",
      "gender": "性别倾向",
      "fullMeaning": "完整含义解释",
      "fullExplanation": "Complete English explanation of the name's meaning, including cultural connotations and traditional symbolism",
      "famousUsers": "历史名人或使用情况",
      "famousUsersExplanation": "English description of famous users or historical usage",
      "fiveElements": {
        "wood": 1,
        "fire": 1,
        "earth": 1,
        "metal": 1,
        "water": 1
      },
      "strokeCount": 15,
      "luckyScore": 88
    }
  ]
}

要求：
1. 姓名要符合中国传统文化和现代审美
2. 提供准确的文化背景和含义解释
3. 考虑五行平衡和笔画数理
4. 确保拼音标注准确
5. 提供真实的历史文化背景
6. 风格要与用户偏好匹配
7. 只提供英文解释，不需要中文解释
8. 英文解释要准确传达中文含义和文化内涵
9. 返回完整的JSON格式，不要包含其他文字`;

  return prompt;
}

function parseGeneratedNames(content: string): any[] {
  try {
    console.log('开始解析内容:', content.substring(0, 200) + '...');
    
    // 尝试提取JSON部分
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      let jsonStr = jsonMatch[0];
      console.log('提取的JSON字符串:', jsonStr.substring(0, 200) + '...');
      
      // 清理JSON字符串，移除可能的格式问题
      jsonStr = jsonStr
        .replace(/\n/g, ' ')  // 移除换行符
        .replace(/\s+/g, ' ')  // 合并多个空格
        .replace(/,\s*}/g, '}')  // 移除尾随逗号
        .replace(/,\s*]/g, ']')  // 移除数组尾随逗号
        .replace(/\s*,\s*}/g, '}')  // 移除对象尾随逗号
        .replace(/\s*,\s*]/g, ']');  // 移除数组尾随逗号
      
      console.log('清理后的JSON:', jsonStr.substring(0, 200) + '...');
      
      const parsed = JSON.parse(jsonStr);
      console.log('解析成功，找到姓名数量:', parsed.names?.length || 0);
      
      // 检查并修复字符数组格式
      if (parsed.names) {
        parsed.names.forEach((name: any, index: number) => {
          if (name.characters && Array.isArray(name.characters)) {
            name.characters = name.characters.map((char: any) => {
              // 如果字符是对象格式，转换为正确格式
              if (typeof char === 'object' && char.char) {
                return {
                  char: char.char,
                  meaning: char.meaning || '',
                  origin: char.origin || '',
                  explanation: char.explanation || ''
                };
              }
              return char;
            });
          }
        });
      }
      
      return parsed.names || [];
    }
    
    console.log('未找到JSON格式，使用默认数据');
    return getDefaultNames();
  } catch (error) {
    console.error('解析生成的姓名时出错:', error);
    console.error('错误位置:', error.message);
    console.error('原始内容前500字符:', content.substring(0, 500));
    console.error('原始内容后500字符:', content.substring(Math.max(0, content.length - 500)));
    return getDefaultNames();
  }
}

function getDefaultNames() {
  return [
    {
      id: 1,
      chinese: '美玲',
      pinyin: 'Měi Líng',
      meaning: 'Beautiful Bell',
      explanation: 'The name "美玲" embodies traditional Chinese cultural appreciation for feminine beauty. "美" represents beauty and elegance, frequently used in classical Chinese literature to describe both inner and outer beauty. "玲" originates from ancient jade ornaments, symbolizing clear, melodious sounds and representing pure, noble character like precious jade. This name carries expectations of gentleness, beauty, and wisdom.',
      characters: [
        { 
          char: '美', 
          meaning: 'Beautiful, pretty', 
          origin: 'Common in classical poetry',
          explanation: 'The character "美" carries profound cultural significance in Chinese tradition, referring not only to physical beauty but also emphasizing inner moral beauty. In classical poetry, "美" is often paired with "德" (virtue), reflecting the Chinese cultural pursuit of both inner and outer cultivation.'
        },
        { 
          char: '玲', 
          meaning: 'Tinkling of jade, delicate sound', 
          origin: 'From ancient jade ornaments',
          explanation: 'The character "玲" originates from the clear, tinkling sound of ancient jade ornaments, symbolizing purity, nobility, and virtuous character. In ancient times, "玲" was often used to describe the melodious voice of women, reflecting admiration for feminine gentleness.'
        }
      ],
      culturalScore: 92,
      style: 'Modern & Elegant',
      commonness: 'Very Common',
      gender: 'Female',
      fullMeaning: 'A name that evokes the image of delicate beauty and grace, like the tinkling sound of jade bells in the wind.',
      fullExplanation: 'The name "美玲" is like a gentle spring breeze, symbolizing pure and noble character like precious jade. It carries traditional Chinese cultural appreciation for feminine beauty, embodying both external elegance and inner moral cultivation. This name suits gentle, intelligent, and well-educated women, symbolizing a bright future and happy life.',
      famousUsers: 'Popular among Chinese women born in 1980s-1990s',
      famousUsersExplanation: 'The name "美玲" was very popular among Chinese women born in the 1980s-1990s, reflecting that era\'s emphasis on traditional virtues. Many well-known women have used this name, achieving excellence in their respective fields.',
      fiveElements: { wood: 2, fire: 1, earth: 1, metal: 1, water: 0 },
      strokeCount: 17,
      luckyScore: 88
    },
    {
      id: 2,
      chinese: '思远',
      pinyin: 'Sī Yuǎn',
      meaning: 'Thinking Far',
      explanation: 'The name "思远" embodies the Confucian philosophy of "cultivating oneself, managing family, governing state, and bringing peace to the world." "思" represents deep thinking and wisdom, reflecting the pursuit of knowledge and virtue. "远" symbolizes lofty aspirations and profound thoughts, suggesting long-term vision and broad-mindedness.',
      characters: [
        { 
          char: '思', 
          meaning: 'Think, consider, miss', 
          origin: 'From Confucian classics',
          explanation: 'The character "思" holds an important position in Confucian classics, emphasizing rational thinking and moral cultivation. Confucius said "Learning without thinking leads to confusion," reflecting the crucial role of thinking in learning and growth.'
        },
        { 
          char: '远', 
          meaning: 'Far, distant, profound', 
          origin: 'Common in philosophical texts',
          explanation: 'The character "远" is commonly used in philosophical texts to express profound thoughts and lofty aspirations. It refers not only to spatial distance but emphasizes depth and breadth of thought, reflecting Chinese culture\'s pursuit of grand ideals.'
        }
      ],
      culturalScore: 95,
      style: 'Classical & Profound',
      commonness: 'Common',
      gender: 'Unisex',
      fullMeaning: 'A philosophical name suggesting deep thinking and far-reaching vision. Often associated with wisdom and ambition.',
      fullExplanation: 'The name "思远" contains profound philosophical connotations, reflecting Chinese culture\'s emphasis on wisdom and virtue. It suits people with intellectual depth and lofty aspirations, symbolizing the spirit of continuous thinking and progress in life.',
      famousUsers: 'Used by scholars and intellectuals throughout Chinese history',
      famousUsersExplanation: 'The name "思远" has been used by many scholars and intellectuals throughout Chinese history, reflecting Chinese culture\'s emphasis on learning and virtue. These figures achieved excellence in their respective fields, making significant contributions to the development of Chinese culture.',
      fiveElements: { wood: 1, fire: 2, earth: 1, metal: 1, water: 0 },
      strokeCount: 16,
      luckyScore: 91
    }
  ];
}
