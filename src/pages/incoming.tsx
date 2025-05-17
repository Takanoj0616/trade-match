import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import styles from '../styles/tradeList.module.css';

type ExchangeRequest = {
  id: string;
  cardId: string;
  cardName: string;
  fromUserId: string;
  fromUserName?: string;
  toUserId: string;
  toUserName?: string;
  message: string;
  createdAt?: Timestamp;
};

const ExchangeRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
      setLoading(true);
      const q = query(
        collection(db, 'exchangeRequests'),
        where('fromUserId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExchangeRequest)));
      setLoading(false);
    };
    fetchRequests();
  }, [user]);

  if (!user) return <div>ログインしてください</div>;
  if (loading) return <div>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => router.push('/')}
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        戻る
      </button>
      <div style={{ maxWidth: 600, margin: '40px auto' }}>
        <h1>送信した交換リクエスト一覧</h1>
        <ul>
          {requests.map(req => (
            <li key={req.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div><b>カード名:</b> {req.cardName}</div>
              <div><b>宛先ユーザー:</b> {req.toUserName || req.toUserId}</div>
              <div><b>メッセージ:</b> {req.message}</div>
              <div style={{ fontSize: 12, color: '#888' }}>
                送信日時: {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleString() : ''}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExchangeRequests;