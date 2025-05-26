import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/users.module.css';
import { useAuth } from '@/hooks/useAuth';

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

const UsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [likedUser, setLikedUser] = useState<string>('');
  const { user } = useAuth();
  const currentUserId = user?.uid;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserId) {
        console.error('currentUserId is not defined');
        return;
      }

      setLoading(true);
      const snap = await getDocs(collection(db, 'users'));
      const userList = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as UserProfile))
        .filter(user => user.id !== currentUserId);
      setUsers(userList);
      setLoading(false);
    };
    // currentUserId が取得できてから fetchUsers を実行
    if (currentUserId) {
      fetchUsers();
    }
  }, [currentUserId]); // currentUserId が変更されたら再度実行

  const handleLike = async (likedUserId: string, likedUsername: string) => {
    if (!currentUserId) {
      alert('ログインが必要です');
      return;
    }

    try {
      // いいねデータを保存
      const likeData = {
        fromUserId: currentUserId,
        toUserId: likedUserId,
        createdAt: Timestamp.now(),
        status: 'pending' // pending, accepted, rejected
      };

      // likesコレクションに保存
      await addDoc(collection(db, 'likes'), likeData);

      // 通知データを保存
      const notificationData = {
        type: 'like',
        fromUserId: currentUserId,
        toUserId: likedUserId,
        createdAt: Timestamp.now(),
        read: false,
        message: `${likedUsername}さんにいいねを送りました`
      };

      // notificationsコレクションに保存
      await addDoc(collection(db, 'notifications'), notificationData);

      // ホップアップ表示
      setLikedUser(likedUsername);
      setShowPopup(true);

      // 3秒後にホップアップを非表示
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

    } catch (error) {
      console.error('いいねの送信に失敗しました:', error);
      alert('いいねの送信に失敗しました。もう一度お試しください。');
    }
  };

  if (!currentUserId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          ログインが必要です
          <Link href="/" className={styles.loginLink}>
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      {showPopup && (
        <div className={styles.popup}>
          {likedUser}さんにいいねを送りました！
        </div>
      )}
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
                onClick={() => handleLike(user.id, user.username)}
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