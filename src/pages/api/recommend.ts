import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { myLikes, partnerLikes } = req.body;

  const prompt = `
あなたはカードゲームのアドバイザーです。
私の好きなカード: ${myLikes}
相手の趣味・趣向: ${partnerLikes}
この2人におすすめのカードを3つ、理由とともに日本語で教えてください。
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    }),
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    // エラー内容を返す
    return res.status(500).json({ result: 'OpenAI APIからの応答が不正です。APIキーや利用状況を確認してください。', error: data });
  }

  res.status(200).json({ result: data.choices[0].message.content });
}