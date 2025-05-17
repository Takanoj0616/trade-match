import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/exchangeRequests.module.css';

type ExchangeRequest = {
  id: string;
  cardId: string;
  cardName: string;
  fromUserId: string;
  fromUserName?: string;
  toUserId: string;
  toUserName?: string;
  message: string;
  createdAt?: any;
};

const ExchangeHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ExchangeRequest[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      // 自分が送信 or 受信したリクエストを両方取得
      const q = query(
        collection(db, 'exchangeRequests'),
        where('fromUserId', '==', user.uid)
      );
      const q2 = query(
        collection(db, 'exchangeRequests'),
        where('toUserId', '==', user.uid)
      );
      const [snap1, snap2] = await Promise.all([getDocs(q), getDocs(q2)]);
      const list1 = snap1.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExchangeRequest));
      const list2 = snap2.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExchangeRequest));
      // 送信・受信をまとめて日付順にソート
      const all = [...list1, ...list2].sort((a, b) => {
        const ta = a.createdAt?.toDate?.() ?? 0;
        const tb = b.createdAt?.toDate?.() ?? 0;
        return tb - ta;
      });
      setHistory(all);
    };
    fetchHistory();
  }, [user]);

  if (!user) return <div>ログインしてください</div>;

  return (
    <div className={styles.container}>
      <h1>カード交換履歴</h1>
      <ul className={styles.requestList}>
        {history.map(req => (
          <li key={req.id} className={styles.requestItem}>
            <div>カード名: {req.cardName}</div>
            <div>送信者: {req.fromUserName || req.fromUserId}</div>
            <div>受信者: {req.toUserName || req.toUserId}</div>
            <div>メッセージ: {req.message}</div>
            <div>日時: {req.createdAt?.toDate?.().toLocaleString?.() ?? ''}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExchangeHistory;