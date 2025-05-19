import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/users.module.css';

const TAG_OPTIONS = ['アニメ', 'サウナ', 'カメラ', 'ゲーム', 'スポーツ', '旅行', '音楽'];

type UserProfile = {
  id: string;
  username: string;
  tags: string[];
  age: number | string;
  gender: string;
  bio: string;
  avatarUrl: string;
  location?: string;
  likes?: number;
};

const UsersPage = ({ currentUserId }: { currentUserId: string }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, 'users'));
      const userList = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as UserProfile))
        .filter(user => user.id !== currentUserId);
      setUsers(userList);
      setLoading(false);

      const usersCollectionRef = collection(db, 'users');
      for (const user of userList) {
        if (!user.username) continue;
        await addDoc(usersCollectionRef, user);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  if (loading) return <div className={styles.loading}>読み込み中...</div>;

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
      <h1 className={styles.title}>お相手一覧</h1>
      <div className={styles.userList}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.avatarContainer}>
              <Image
                src={user.avatarUrl && user.avatarUrl !== '' ? user.avatarUrl : '/dummy.png'}
                alt={user.username}
                width={120}
                height={120}
                className={styles.avatar}
              />
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.username}>{user.username}</h2>
              <div className={styles.userDetail}>年齢: {user.age}</div>
              <div className={styles.userDetail}>性別: {user.gender}</div>
              {user.tags && user.tags.length > 0 && (
                <div className={styles.tags}>
                  {user.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.bio}>{user.bio}</div>
              <button
                onClick={() => {/* ここでhandleLike(currentUserId, user.id)などを呼び出し */}}
                className={styles.likeButton}
              >
                いいね
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;