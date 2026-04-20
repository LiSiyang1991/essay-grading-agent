import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const essay = body.essay;

    if (!essay || !essay.trim()) {
      return Response.json(
        { error: "Essay is required." },
        { status: 400 }
      );
    }

    const prompt = `
      你是一名作文评分老师。请根据以下维度对作文进行评分：
      1. 内容（满分30）
      2. 结构（满分30）
      3. 语言（满分40）

      请严格按照下面的 JSON 格式返回，不要输出任何多余文字：

      {
        "overallScore": 总分数字,
        "contentScore": 内容分数字,
        "organizationScore": 结构分数字,
        "languageScore": 语言分数字,
        "feedback": "一段简短评语"
      }

      作文内容：
      ${essay}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "你是一个严谨的作文评分助手，只输出合法 JSON。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object"},
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content;
    const result = JSON.parse(text);

    return Response.json(result);
  } catch (error) {
    console.error("Grading error:", error);

    return Response.json(
      { error: "Failed to grade essay." },
      { status: 500 }
    );
  }
}