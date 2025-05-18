import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import styles from '../styles/cardDetail.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type TradeCard = {
  id: string;
  name: string;
  imageUrl: string;
  hp: number;
  type: string;
  ownerId: string;
  ownerName?: string;
  price?: number;
};

const Payment = () => {
  const router = useRouter();
  const { cardId, price } = router.query;
  const [card, setCard] = useState<TradeCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      if (!cardId) return;
      
      const docRef = doc(db, 'tradeCards', cardId as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setCard({ id: docSnap.id, ...docSnap.data() } as TradeCard);
      }
      setLoading(false);
    };

    fetchCard();
  }, [cardId]);

  const handlePayment = async () => {
    if (!card || !price) return;
    
    try {
      setProcessing(true);
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(price),
          cardId: card.id,
          cardName: card.name,
          ownerId: card.ownerId
        }),
      });

      const { id } = await res.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripeの初期化に失敗しました');
      }

      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error('決済処理でエラーが発生しました:', error);
      alert('決済処理中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (!card) return <div>カード情報が見つかりません</div>;

  return (
    <div className={styles.cardDetail}>
      <h1>決済画面</h1>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2>購入内容の確認</h2>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <img src={card.imageUrl} alt={card.name} width={200} className={styles.cardImage} />
          <div className={styles.cardName}>名前: {card.name}</div>
          <div className={styles.cardHp}>HP: {card.hp}</div>
          <div className={styles.cardType}>タイプ: {card.type}</div>
          <div>出品者: {card.ownerName || card.ownerId}</div>
          <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '10px' }}>
            支払い金額: {price}円
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          style={{
            backgroundColor: processing ? '#cccccc' : '#4CAF50',
            color: 'white',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '4px',
            cursor: processing ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            width: '100%'
          }}
        >
          {processing ? '処理中...' : '決済を完了する'}
        </button>
      </div>
    </div>
  );
};

export default Payment; 