import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/cardDetail.module.css';

type CardRecommendation = {
  cardName: string;
  reason: string;
  deckIntegration: string;
  imageUrl?: string;
};

const RecommendCards = () => {
  const [recommendations, setRecommendations] = useState<CardRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getRecommendation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          myLikes: 'リザードン, ピカチュウ',
          partnerLikes: '水タイプ, かわいいカード',
        }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('おすすめカードの取得に失敗しました:', error);
      alert('おすすめカードの取得に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDeck = (cardName: string) => {
    // デッキに追加する処理を実装
    router.push({
      pathname: '/deck',
      query: { addCard: cardName }
    });
  };

  return (
    <div className={styles.cardDetail} style={{ maxWidth: 800, margin: '40px auto', padding: '20px' }}>
      <h1>おすすめカード</h1>
      <button
        onClick={getRecommendation}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#cccccc' : '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? '取得中...' : 'おすすめカードを取得'}
      </button>

      {recommendations.length > 0 && (
        <div className={styles.recommendationList}>
          {recommendations.map((card, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: 'white'
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt={card.cardName}
                    style={{ width: '150px', height: 'auto', borderRadius: '4px' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h2 style={{ marginTop: 0 }}>{card.cardName}</h2>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>おすすめの理由：</strong>
                    <p>{card.reason}</p>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>デッキへの取り入れ方：</strong>
                    <p>{card.deckIntegration}</p>
                  </div>
                  <button
                    onClick={() => handleAddToDeck(card.cardName)}
                    style={{
                      backgroundColor: '#2196F3',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    デッキに追加
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendCards;