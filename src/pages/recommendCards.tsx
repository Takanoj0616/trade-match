import { useState } from 'react';

const RecommendCards = () => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    setLoading(true);
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        myLikes: 'リザードン, ピカチュウ',
        partnerLikes: '水タイプ, かわいいカード',
      }),
    });
    const data = await res.json();
    setRecommendation(data.result);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h1>おすすめカードを表示</h1>
      <button onClick={getRecommendation}>おすすめカードを取得</button>
      {loading && <div>取得中...</div>}
      <div style={{ whiteSpace: 'pre-line', marginTop: 24 }}>{recommendation}</div>
    </div>
  );
};

export default RecommendCards;