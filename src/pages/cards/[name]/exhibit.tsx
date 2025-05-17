import { useRouter } from 'next/router';
import dummyCards from '../../../../data/dummyCards.json';
import styles from '../../../styles/cardDetail.module.css';
import { useAuth } from '../../../hooks/useAuth';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useState } from 'react';

const ExhibitCard = () => {
  const router = useRouter();
  const { name } = router.query;
  const { user } = useAuth();
  const [price, setPrice] = useState('');

  const card = dummyCards.find((c) => c.name === name);

  const handleExhibit = async () => {
    if (!card || !user || !price) return;
    await addDoc(collection(db, 'tradeCards'), {
      ...card,
      ownerId: user.uid,
      ownerName: user.displayName,
      exhibitedAt: new Date(),
      price: Number(price),
    });
    alert('カードを出品しました');
    router.push('/tradeList');
  };

  if (!card) return <div>カードが見つかりません</div>;

  return (
    <div className={styles.cardDetail}>
      <div className={styles.cardName}>名前: {card.name}</div>
      <img src={card.imageUrl} alt={card.name} width={300} className={styles.cardImage} />
      <div className={styles.cardHp}>HP: {card.hp}</div>
      <div className={styles.cardType}>タイプ: {card.type}</div>
      <div>
        <label>
          出品金額（円）:
          <input
            type="number"
            value={price}
            min={0}
            onChange={e => setPrice(e.target.value)}
            className={styles.priceInput}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <button className={styles.exhibitButton} onClick={handleExhibit} disabled={!price}>
        出品
      </button>
    </div>
  );
};

export default ExhibitCard;