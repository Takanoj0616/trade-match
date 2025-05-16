import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/exchangeRequests.module.css';

const ExchangeRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
      const q = query(
        collection(db, 'exchangeRequests'),
        where('toUserId', '==', user.uid)
      );
      const snap = await getDocs(q);
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRequests();
  }, [user]);

  if (!user) return <div>ログインしてください</div>;

  return (
    <div className={styles.container}>
      <h1>あなた宛の交換リクエスト</h1>
      <ul className={styles.requestList}>
        {requests.map(req => (
          <li key={req.id} className={styles.requestItem}>
            <div>カード名: {req.cardName}</div>
            <div>依頼者: {req.fromUserName}</div>
            <div>メッセージ: {req.message}</div>
            <div>日時: {req.createdAt?.toDate?.().toLocaleString?.() ?? ''}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExchangeRequests;