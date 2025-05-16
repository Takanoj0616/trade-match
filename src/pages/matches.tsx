import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';

const MatchesPage = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const currentUserId = "currentUser123"; // 現在のユーザーID（仮置き）

  useEffect(() => {
    const fetchMatches = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const currentUser = snapshot.docs.find((doc) => doc.id === currentUserId)?.data();
      setMatches(currentUser?.matches || []);
    };

    fetchMatches();
  }, []);

  if (!matches || matches.length === 0) {
    return <p>マッチングした相手がいません。</p>;
  }

  return (
    <div>
      <h1>マッチング一覧</h1>
      <ul>
        {matches.map((matchId) => (
          <li key={matchId}>
            <Link href={`/messages/${matchId}`}>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                {matchId} とメッセージ
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchesPage;