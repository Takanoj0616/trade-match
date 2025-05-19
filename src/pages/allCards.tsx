import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth'; // ユーザー情報取得用のカスタムフック（なければuserIdをprops等で渡してください）
import styles from '@/styles/cards.module.css';

type Card = {
  id: string;
  name?: string;
  imageUrl: string;
  ownerId: string;
  uploadedAt?: {
    toDate: () => Date;
  };
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
      setCards(cardList);
      setLoading(false);
    };
    fetchCards();
  }, []);

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  if (cards.length === 0) {
    return (
      <div className={styles.container}>
        <Link href="/" className={styles.backButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          戻る
        </Link>
        <div className={styles.emptyState}>
          表示できるカードがありません。
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        戻る
      </Link>
      <h1 className={styles.title}>カード一覧</h1>
      <div className={styles.cardsGrid}>
        {cards.map(card => (
          <div key={card.id} className={styles.card}>
            <img
              src={card.imageUrl}
              alt={card.name || 'カード'}
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <h2 className={styles.cardName}>{card.name || '未設定'}</h2>
              <div className={styles.cardInfo}>
                <strong>オーナーID:</strong> {card.ownerId}
              </div>
              {card.uploadedAt && (
                <div className={styles.cardDate}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {card.uploadedAt.toDate().toLocaleDateString()}
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