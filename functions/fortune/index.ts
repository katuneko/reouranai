import { OpenAI } from '@cloudflare/openai';

export interface Env {
  OPENAI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env) {
    if (request.method !== 'POST')
      return new Response('Method Not Allowed', { status: 405 });

    const { seed, snacks } = await request.json();

    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    const prompt = `あなたは陽気な犬レオです。以下のおやつリストをもとに JSON を返してください。\nおやつ: ${snacks.join(', ')}\nフォーマット: {\n  \"grade\": \\"大吉|中吉|吉|小吉|末吉|凶|大凶\",\n  \\"message\": \\"40文字以内のレオ口調メッセージ\"\n}`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return new Response(chat.choices[0].message.content, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};