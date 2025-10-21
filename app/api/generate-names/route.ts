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
      "bilingualExplanation": {
        "chinese": "中文详细解释，包含文化背景、寓意和传统意义",
        "english": "English detailed explanation including cultural background, symbolism and traditional meaning"
      },
      "characters": [
        {
          "char": "字",
          "meaning": "字义解释",
          "origin": "字源出处",
          "bilingualExplanation": {
            "chinese": "该字的中文详细解释",
            "english": "English explanation of this character"
          }
        }
      ],
      "culturalScore": 85,
      "style": "风格描述",
      "commonness": "常见程度",
      "gender": "性别倾向",
      "fullMeaning": "完整含义解释",
      "bilingualFullMeaning": {
        "chinese": "姓名的完整中文含义解释，包含文化内涵和传统寓意",
        "english": "Complete English explanation of the name's meaning, including cultural connotations and traditional symbolism"
      },
      "famousUsers": "历史名人或使用情况",
      "bilingualFamousUsers": {
        "chinese": "中文历史名人或使用情况说明",
        "english": "English description of famous users or historical usage"
      },
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
7. 为每个字段提供中英文双语解释
8. 中文解释要体现深厚的文化内涵
9. 英文解释要准确传达中文含义
10. 返回完整的JSON格式，不要包含其他文字`;

  return prompt;
}

function parseGeneratedNames(content: string): any[] {
  try {
    // 尝试提取JSON部分
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      let jsonStr = jsonMatch[0];
      
      // 清理JSON字符串，移除可能的格式问题
      jsonStr = jsonStr
        .replace(/\n/g, ' ')  // 移除换行符
        .replace(/\s+/g, ' ')  // 合并多个空格
        .replace(/,\s*}/g, '}')  // 移除尾随逗号
        .replace(/,\s*]/g, ']');  // 移除数组尾随逗号
      
      const parsed = JSON.parse(jsonStr);
      return parsed.names || [];
    }
    
    // 如果没有找到JSON，返回默认数据
    return getDefaultNames();
  } catch (error) {
    console.error('解析生成的姓名时出错:', error);
    console.error('原始内容:', content.substring(0, 500));
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
      bilingualExplanation: {
        chinese: '美玲这个名字体现了中华文化中对女性美的传统认知。"美"字代表美丽、优雅，在中国古典文学中常用来形容女性的内在和外在美。"玲"字源自古代玉器，象征着清脆悦耳的声音，寓意着如玉石般纯洁美好的品格。这个名字承载着对女性温柔、美丽、聪慧品质的期望。',
        english: 'The name "美玲" embodies traditional Chinese cultural appreciation for feminine beauty. "美" represents beauty and elegance, frequently used in classical Chinese literature to describe both inner and outer beauty. "玲" originates from ancient jade ornaments, symbolizing clear, melodious sounds and representing pure, noble character like precious jade. This name carries expectations of gentleness, beauty, and wisdom.'
      },
      characters: [
        { 
          char: '美', 
          meaning: 'Beautiful, pretty', 
          origin: 'Common in classical poetry',
          bilingualExplanation: {
            chinese: '"美"字在中华文化中具有深厚内涵，不仅指外在的美丽，更强调内在的品德之美。在古代诗词中，"美"常与"德"并提，体现了中华文化对内外兼修的追求。',
            english: 'The character "美" carries profound cultural significance in Chinese tradition, referring not only to physical beauty but also emphasizing inner moral beauty. In classical poetry, "美" is often paired with "德" (virtue), reflecting the Chinese cultural pursuit of both inner and outer cultivation.'
          }
        },
        { 
          char: '玲', 
          meaning: 'Tinkling of jade, delicate sound', 
          origin: 'From ancient jade ornaments',
          bilingualExplanation: {
            chinese: '"玲"字源于古代玉器的清脆声响，象征着纯洁、高贵和美好的品格。在古代，"玲"常用来形容女子声音的悦耳动听，体现了对女性温柔特质的赞美。',
            english: 'The character "玲" originates from the clear, tinkling sound of ancient jade ornaments, symbolizing purity, nobility, and virtuous character. In ancient times, "玲" was often used to describe the melodious voice of women, reflecting admiration for feminine gentleness.'
          }
        }
      ],
      culturalScore: 92,
      style: 'Modern & Elegant',
      commonness: 'Very Common',
      gender: 'Female',
      fullMeaning: 'A name that evokes the image of delicate beauty and grace, like the tinkling sound of jade bells in the wind.',
      bilingualFullMeaning: {
        chinese: '美玲这个名字如春风拂面，寓意着如玉石般纯洁美好的品格。它承载着中华文化对女性美的传统认知，既体现了外在的优雅美丽，更强调内在的品德修养。这个名字适合温柔、聪慧、有教养的女性，象征着美好的未来和幸福的人生。',
        english: 'The name "美玲" is like a gentle spring breeze, symbolizing pure and noble character like precious jade. It carries traditional Chinese cultural appreciation for feminine beauty, embodying both external elegance and inner moral cultivation. This name suits gentle, intelligent, and well-educated women, symbolizing a bright future and happy life.'
      },
      famousUsers: 'Popular among Chinese women born in 1980s-1990s',
      bilingualFamousUsers: {
        chinese: '美玲这个名字在1980-1990年代出生的中国女性中非常流行，体现了那个时代对传统美德的重视。许多知名女性都使用这个名字，她们在各自的领域都取得了卓越成就。',
        english: 'The name "美玲" was very popular among Chinese women born in the 1980s-1990s, reflecting that era\'s emphasis on traditional virtues. Many well-known women have used this name, achieving excellence in their respective fields.'
      },
      fiveElements: { wood: 2, fire: 1, earth: 1, metal: 1, water: 0 },
      strokeCount: 17,
      luckyScore: 88
    },
    {
      id: 2,
      chinese: '思远',
      pinyin: 'Sī Yuǎn',
      meaning: 'Thinking Far',
      bilingualExplanation: {
        chinese: '思远这个名字体现了中华文化中"修身、齐家、治国、平天下"的儒家思想。"思"代表深思熟虑、智慧思考，体现了对学问和品德的追求；"远"象征着远大的志向和深邃的思想，寓意着要有长远的眼光和博大的胸怀。',
        english: 'The name "思远" embodies the Confucian philosophy of "cultivating oneself, managing family, governing state, and bringing peace to the world." "思" represents deep thinking and wisdom, reflecting the pursuit of knowledge and virtue. "远" symbolizes lofty aspirations and profound thoughts, suggesting long-term vision and broad-mindedness.'
      },
      characters: [
        { 
          char: '思', 
          meaning: 'Think, consider, miss', 
          origin: 'From Confucian classics',
          bilingualExplanation: {
            chinese: '"思"字在儒家经典中具有重要地位，强调理性思考和道德修养。孔子曾说"学而不思则罔"，体现了思考在学习和成长中的重要作用。',
            english: 'The character "思" holds an important position in Confucian classics, emphasizing rational thinking and moral cultivation. Confucius said "Learning without thinking leads to confusion," reflecting the crucial role of thinking in learning and growth.'
          }
        },
        { 
          char: '远', 
          meaning: 'Far, distant, profound', 
          origin: 'Common in philosophical texts',
          bilingualExplanation: {
            chinese: '"远"字在哲学文本中常用来表达深邃的思想和远大的志向。它不仅仅指空间上的距离，更强调思想上的深度和广度，体现了中华文化对远大理想的追求。',
            english: 'The character "远" is commonly used in philosophical texts to express profound thoughts and lofty aspirations. It refers not only to spatial distance but emphasizes depth and breadth of thought, reflecting Chinese culture\'s pursuit of grand ideals.'
          }
        }
      ],
      culturalScore: 95,
      style: 'Classical & Profound',
      commonness: 'Common',
      gender: 'Unisex',
      fullMeaning: 'A philosophical name suggesting deep thinking and far-reaching vision. Often associated with wisdom and ambition.',
      bilingualFullMeaning: {
        chinese: '思远这个名字蕴含着深厚的哲学内涵，体现了中华文化对智慧和品德的重视。它适合有思想深度、有远大抱负的人，象征着在人生道路上不断思考、不断前进的精神。',
        english: 'The name "思远" contains profound philosophical connotations, reflecting Chinese culture\'s emphasis on wisdom and virtue. It suits people with intellectual depth and lofty aspirations, symbolizing the spirit of continuous thinking and progress in life.'
      },
      famousUsers: 'Used by scholars and intellectuals throughout Chinese history',
      bilingualFamousUsers: {
        chinese: '思远这个名字在中国历史上被许多学者和知识分子使用，体现了中华文化对学问和品德的重视。这些人物在各自的领域都取得了卓越成就，为中华文化的发展做出了重要贡献。',
        english: 'The name "思远" has been used by many scholars and intellectuals throughout Chinese history, reflecting Chinese culture\'s emphasis on learning and virtue. These figures achieved excellence in their respective fields, making significant contributions to the development of Chinese culture.'
      },
      fiveElements: { wood: 1, fire: 2, earth: 1, metal: 1, water: 0 },
      strokeCount: 16,
      luckyScore: 91
    }
  ];
}
