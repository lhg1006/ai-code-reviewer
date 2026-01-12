import OpenAI from 'openai';
import { CodeReview, ProgrammingLanguage } from '@/types/review';

export async function* streamCodeReview(
  apiKey: string,
  code: string,
  language: ProgrammingLanguage
): AsyncGenerator<string> {
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `당신은 시니어 소프트웨어 엔지니어입니다. 다음 ${language} 코드를 리뷰해주세요.

\`\`\`${language}
${code}
\`\`\`

다음 관점에서 분석해주세요:

1. **버그 가능성**: 잠재적인 버그나 에러가 발생할 수 있는 부분
2. **성능**: 성능 개선이 필요한 부분
3. **보안**: 보안 취약점이 있는지
4. **코드 스타일**: 가독성, 네이밍, 구조 개선점
5. **리팩토링 제안**: 더 나은 패턴이나 구조 제안

각 이슈에 대해:
- 문제가 있는 라인 번호 (가능한 경우)
- 문제 설명
- 개선 방법

마지막에 전체 요약과 개선된 코드 예시를 제공해주세요.`;

  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: '당신은 꼼꼼하고 건설적인 코드 리뷰를 제공하는 시니어 개발자입니다. 한국어로 응답하며, 마크다운 형식을 사용합니다.',
      },
      { role: 'user', content: prompt },
    ],
    stream: true,
    temperature: 0.3,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

export async function generateQuickReview(
  apiKey: string,
  code: string,
  language: ProgrammingLanguage
): Promise<CodeReview> {
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `다음 ${language} 코드를 분석하고 JSON 형식으로 리뷰 결과를 반환해주세요.

\`\`\`${language}
${code}
\`\`\`

JSON 형식:
{
  "summary": "전체 요약 (1-2문장)",
  "issues": [
    {
      "type": "bug|performance|security|style|suggestion",
      "severity": "low|medium|high",
      "line": 라인번호 또는 null,
      "message": "문제 설명",
      "suggestion": "개선 방법"
    }
  ],
  "suggestions": ["전체적인 개선 제안들"],
  "securityConcerns": ["보안 관련 우려사항"],
  "overallQuality": "good|needs-improvement|poor"
}`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: '당신은 코드 리뷰 전문가입니다. JSON 형식으로만 응답합니다.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content || '{}';

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse review:', e);
  }

  return {
    summary: '리뷰 생성에 실패했습니다.',
    issues: [],
    suggestions: [],
    securityConcerns: [],
    overallQuality: 'needs-improvement',
  };
}
