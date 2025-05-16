import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth'; // ユーザー情報取得用のカスタムフック（なければuserIdをprops等で渡してください）

type Card = {
  id: string;
  name?: string;
  imageUrl: string;
  ownerId: string;
  uploadedAt?: any;
};

const AllCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 現在ログイン中のユーザー

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, 'tradeCards'));
      const cardList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Card[];
      // 自分のカードを除外
      const filtered = user
        ? cardList.filter(card => card.ownerId !== user.uid)
        : cardList;
      setCards(filtered);
      setLoading(false);
    };
    fetchCards();
  }, [user]);

  if (loading) return <div>読み込み中...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1>全体カード一覧（自分のカードを除く）</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {cards.map(card => (
          <div key={card.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 220 }}>
            <img src={card.imageUrl} alt={card.name || 'カード'} width={180} style={{ borderRadius: 8 }} />
            <div style={{ marginTop: 8 }}>
              <div><b>名前:</b> {card.name || '未設定'}</div>
              <div><b>オーナーID:</b> {card.ownerId}</div>
              {card.uploadedAt && (
                <div style={{ fontSize: 12, color: '#888' }}>
                  登録日: {card.uploadedAt.toDate ? card.uploadedAt.toDate().toLocaleDateString() : ''}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCards;