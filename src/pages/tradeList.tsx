import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/tradeList.module.css';
import { useRouter } from 'next/router';

const TradeList = () => {
  const [tradeCards, setTradeCards] = useState<any[]>([]);
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCards = async () => {
      const snap = await getDocs(collection(db, 'tradeCards'));
      let cards = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // 自分が出したカードを除外
      if (user) {
        cards = cards.filter(card => card.ownerId !== user.uid);
      }
      setTradeCards(cards);
    };
    fetchCards();
  }, [user]);

  const handleTrade = async (card: any) => {
    if (!user) {
      alert('ログインしてください');
      return;
    }
    await addDoc(collection(db, 'exchangeRequests'), {
      cardId: card.id,
      cardName: card.name,
      fromUserId: user.uid,
      fromUserName: user.displayName,
      toUserId: card.ownerId,
      toUserName: card.ownerName,
      message,
      createdAt: serverTimestamp(),
    });
    alert('交換リクエストを送りました');
    setMessage('');
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => router.push('/')}
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        戻る
      </button>
      <h1>交換カード一覧</h1>
      <ul className={styles.cardList}>
        {tradeCards.map((card, idx) => (
          <li key={idx} className={styles.cardItem}>
            <div className={styles.cardName}>名前: {card.name}</div>
            <img src={card.imageUrl} alt={card.name} width={200} className={styles.cardImage} />
            <div className={styles.cardHp}>HP: {card.hp}</div>
            <div className={styles.cardType}>タイプ: {card.type}</div>
            {user && card.ownerId !== user.uid && (
              <div>
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="メッセージを入力"
                  className={styles.messageInput}
                />
                <button className={styles.tradeButton} onClick={() => handleTrade(card)}>
                  交換する
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradeList;