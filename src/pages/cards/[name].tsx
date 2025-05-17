import { useRouter } from 'next/router';
import dummyCards from '../../../data/dummyCards.json';
import styles from '../../styles/cardDetail.module.css';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const CardDetail = () => {
  const router = useRouter();
  const { name } = router.query;
  const { user } = useAuth();

  const card = dummyCards.find((c) => c.name === name);

  const handleAddToTrade = async () => {
    if (!card || !user) return;
    await addDoc(collection(db, 'tradeCards'), {
      ...card,
      ownerId: user.uid,
      ownerName: user.displayName,
    });
    alert('交換リストに追加しました');
  };

  if (!card) {
    return <div>カードが見つかりません</div>;
  }

  return (
    <div className={styles.cardDetail}>
      <div className={styles.cardName}>名前: {card.name}</div>
      <img src={card.imageUrl} alt={card.name} width={300} className={styles.cardImage} />
      <div className={styles.cardHp}>HP: {card.hp}</div>
      <div className={styles.cardType}>タイプ: {card.type}</div>
      <button className={styles.tradeButton} onClick={handleAddToTrade}>交換に出す</button>
      {user && (
        <button
          className={styles.exhibitButton}
          onClick={() => router.push(`/cards/${card.name}/exhibit`)}
        >
          出品する
        </button>
      )}
    </div>
  );
};

export default CardDetail;