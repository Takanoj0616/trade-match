import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Settlement = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 50000 }), // 例: 500円
    });
    const { id } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: id });
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1>決済ページ</h1>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? '処理中...' : '500円でガチャを引く'}
      </button>
    </div>
  );
};

export default Settlement;