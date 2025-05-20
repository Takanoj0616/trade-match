import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/showCards.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ShowCards = () => {
  const [cards, setCards] = useState<any[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchCards = async () => {
      const snap = await getDocs(collection(db, 'tradeCards'));
      // 自分が作成したカードのみ表示
      setCards(
        snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(card => card.ownerId === user.uid)
      );
    };
    fetchCards();
  }, [user]);

  if (!user) return <div>ログインしてください</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        戻る
      </button>
      <h1 className={styles.title}>自分のカード一覧</h1>
      <ul className={styles.cardList}>
        {cards.map((card, idx) => (
          <li key={card.id || idx} className={styles.cardItem}>
            <Link href={`/cards/${card.name}`}>
              <div className={styles.cardName} style={{ cursor: 'pointer', color: '#1976d2' }}>
                名前: {card.name}
              </div>
              <img src={card.imageUrl} alt={card.name} width={200} className={styles.cardImage} />
            </Link>
            <div>HP: {card.hp}</div>
            <div>タイプ: {card.type}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowCards;