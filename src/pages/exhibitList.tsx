import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import styles from '../styles/cardDetail.module.css';

type TradeCard = {
  id: string;
  name: string;
  imageUrl: string;
  hp: number;
  type: string;
  ownerId: string;
  ownerName?: string;
  exhibitedAt?: any;
  price?: number;
};

const ExhibitList = () => {
  const [cards, setCards] = useState<TradeCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      const qRef = query(collection(db, 'tradeCards'), orderBy('exhibitedAt', 'desc'));
      const snap = await getDocs(qRef);
      setCards(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TradeCard)));
      setLoading(false);
    };
    fetchCards();
  }, []);

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className={styles.cardDetail}>
      <h1>出品一覧</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cards.map(card => (
          <li key={card.id} style={{ marginBottom: 32, border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
            <div className={styles.cardName}>名前: {card.name}</div>
            <img src={card.imageUrl} alt={card.name} width={200} className={styles.cardImage} />
            <div className={styles.cardHp}>HP: {card.hp}</div>
            <div className={styles.cardType}>タイプ: {card.type}</div>
            <div>出品者: {card.ownerName || card.ownerId}</div>
            <div>出品金額: {card.price ? `${card.price}円` : '未設定'}</div>
            <div>出品日時: {card.exhibitedAt?.toDate ? card.exhibitedAt.toDate().toLocaleString() : ''}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExhibitList;