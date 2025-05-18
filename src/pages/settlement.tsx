import { useState } from 'react';
import { useRouter } from 'next/router';

const GachaEffect = ({ onEnd }: { onEnd: () => void }) => {
  // 2秒間の演出
  setTimeout(onEnd, 2000);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)',
        borderRadius: '50%', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 60px 20px #fff, 0 0 120px 40px #ff4e50'
      }}>
        <div style={{
          color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', animation: 'spin 2s linear infinite'
        }}>
          ガチャを引いています…<br />
          <span style={{ fontSize: 60 }}>✨</span>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

const Settlement = () => {
  const [showEffect, setShowEffect] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGacha = () => {
    setShowEffect(true);
  };

  const handleEffectEnd = () => {
    setShowEffect(false);
    // ここで決済ページに遷移
    router.push('/payment');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: 32, color: '#ff4e50', textShadow: '2px 2px 8px #fff' }}>
        ガチャを引く
      </h1>
      <button
        onClick={handleGacha}
        disabled={loading}
        style={{
          background: 'linear-gradient(90deg, #f9d423 0%, #ff4e50 100%)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          padding: '20px 60px',
          border: 'none',
          borderRadius: '50px',
          boxShadow: '0 8px 32px 0 rgba(255,78,80,0.2)',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
      >
        {loading ? '処理中...' : 'ガチャを引く！'}
      </button>
      {showEffect && <GachaEffect onEnd={handleEffectEnd} />}
    </div>
  );
};

export default Settlement;