import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import styles from '@/styles/matches.module.css';

type Match = {
  id: string;
  username: string;
  lastMessage?: string;
  timestamp?: Date;
};

const MatchesPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = "currentUser123"; // 現在のユーザーID（仮置き）

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'users'));
      const currentUser = snapshot.docs.find((doc) => doc.id === currentUserId)?.data();
      const matchIds = currentUser?.matches || [];
      
      // マッチしたユーザーの詳細情報を取得
      const matchDetails = await Promise.all(
        matchIds.map(async (matchId: string) => {
          const matchDoc = snapshot.docs.find((doc) => doc.id === matchId);
          return {
            id: matchId,
            username: matchDoc?.data()?.username || 'Unknown User',
            lastMessage: 'メッセージを送信しましょう',
            timestamp: new Date()
          };
        })
      );
      
      setMatches(matchDetails);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  if (!matches || matches.length === 0) {
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
          マッチングした相手がいません。
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
      <h1 className={styles.title}>マッチング一覧</h1>
      <div className={styles.matchesList}>
        {matches.map((match) => (
          <div key={match.id} className={styles.matchCard}>
            <h3 className={styles.username}>{match.username}</h3>
            <p className={styles.lastMessage}>{match.lastMessage}</p>
            <Link href={`/messages/${match.id}`} className={styles.messageButton}>
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              メッセージを送る
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesPage;