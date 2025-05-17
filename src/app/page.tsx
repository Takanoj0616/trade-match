'use client';

import { useRouter } from 'next/navigation';
import styles from '../styles/Home.module.css';
import ProfileView from '../components/ProfileView';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return <div>ログインしてください</div>;
  }

  return (
    <main className={styles.main}>
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <button onClick={logout} className={styles.logoutButton}>
          ログアウト
        </button>
      </div>
      <ProfileView userId={user.uid} />
      <div className={styles.buttonContainer}>
        <button onClick={() => router.push('/edit')} className={styles.buttonBlue}>
          プロフィール編集
        </button>
        <button onClick={() => router.push('/users')} className={styles.buttonGreen}>
          お相手一覧
        </button>
        <button onClick={() => router.push('/matches')} className={styles.buttonPurple}>
          マッチング一覧
        </button>
        <button onClick={() => router.push('/showCards')} className={styles.buttonPurple}>
          自分のカード一覧
        </button>
        <button onClick={() => router.push('/allCards')} className={styles.buttonPurple}>
          全体カード一覧
        </button>
        <button onClick={() => router.push('/tradeList')} className={styles.buttonPurple}>
          交換リスト
        </button>
        <button onClick={() => router.push('/exchangeRequests')} className={styles.buttonPurple}>
          あなた宛交換リクエスト
        </button>
        <button onClick={() => router.push('/incoming')} className={styles.buttonPurple}>
          あなたが送った交換リクエスト
        </button>
        <button onClick={() => router.push('/exchangeHistory')} className={styles.buttonPurple}>
          交換履歴
        </button>
        <button onClick={() => router.push('/exhibitList')} className={styles.buttonPurple}>
          出品一覧
        </button>
        <button onClick={() => router.push('/createCard')} className={styles.buttonPurple}>
          カード新規作成
        </button>
        <button onClick={() => router.push('/recommendCards')} className={styles.buttonPurple}>
          おすすめ一覧
        </button>
        <button onClick={() => router.push('/settlement')} className={styles.buttonPurple}>
          決済
        </button>
      </div>
    </main>
  );
};

export default HomePage;