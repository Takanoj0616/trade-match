import { NextApiRequest, NextApiResponse } from 'next';

type CardRecommendation = {
  cardName: string;
  reason: string;
  deckIntegration: string;
  imageUrl?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { myLikes, partnerLikes } = req.body;

    // ChatGPTに投げるプロンプト
    const prompt = `
あなたはポケモンカードのデッキアドバイザーです。
私の好きなカード: ${myLikes}
パートナーの好み: ${partnerLikes}
この2人におすすめのカードを3つ、以下のJSON形式で日本語で出力してください。
imageUrlには、できるだけ https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/ の公式画像URLを使ってください。なければ空文字で。
[
  {
    "cardName": "カード名",
    "reason": "おすすめの理由",
    "deckIntegration": "デッキへの取り入れ方",
    "imageUrl": "カード画像のURL（なければ空文字）"
  },
  ...
]
`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ message: 'OpenAI APIからの応答が不正です。', error: data });
    }

    // ChatGPTの返答からJSON部分を抽出
    const content = data.choices[0].message.content;
    const jsonStart = content.indexOf('[');
    const jsonEnd = content.lastIndexOf(']');
    let recommendations: CardRecommendation[] = [];
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = content.substring(jsonStart, jsonEnd + 1);
      recommendations = JSON.parse(jsonString);
    } else {
      // フォールバック
      recommendations = [];
    }

    // 画像URLが空の場合に自動補完
    for (const rec of recommendations) {
      if (!rec.imageUrl || rec.imageUrl === "") {
        // 例: カード名からPokeAPIの画像URLを自動生成
        const nameToId: Record<string, number> = {
          "ミュウツー": 150,
          "ラプラス": 131,
          "ピカチュウ": 25,
          // 必要に応じて追加
        };
        if (nameToId[rec.cardName]) {
          rec.imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nameToId[rec.cardName]}.png`;
        }
      }
    }

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
}