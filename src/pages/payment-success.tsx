import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import styles from '../styles/cardDetail.module.css';

const PaymentSuccess = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const updateCardOwnership = async () => {
      if (!session_id) return;

      try {
        // ここでStripeのセッション情報を取得し、カードの所有権を更新する処理を実装
        // 実際の実装では、StripeのWebhookを使用して決済完了を検知し、
        // その時点でカードの所有権を更新することをお勧めします

        setStatus('success');
      } catch (error) {
        console.error('カードの所有権更新でエラーが発生しました:', error);
        setStatus('error');
      }
    };

    updateCardOwnership();
  }, [session_id]);

  if (status === 'loading') {
    return (
      <div className={styles.cardDetail}>
        <h1>処理中...</h1>
        <p>カードの所有権を更新しています。しばらくお待ちください。</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.cardDetail}>
        <h1>エラーが発生しました</h1>
        <p>カードの所有権の更新に失敗しました。サポートにお問い合わせください。</p>
        <button
          onClick={() => router.push('/exhibitList')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          出品一覧に戻る
        </button>
      </div>
    );
  }

  return (
    <div className={styles.cardDetail}>
      <h1>購入完了</h1>
      <p>カードの購入が完了しました！</p>
      <button
        onClick={() => router.push('/exhibitList')}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        出品一覧に戻る
      </button>
    </div>
  );
};

export default PaymentSuccess; 