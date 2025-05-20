import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from '../styles/createCard.module.css';

const CreateCard = () => {
  const [name, setName] = useState('');
  const [hp, setHp] = useState('');
  const [type, setType] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('ログインしてください');
      return;
    }
    if (!name || !hp || !type || !imageFile) {
      alert('全ての項目を入力してください');
      return;
    }

    // 画像をFirebase Storageにアップロード
    const storage = getStorage();
    const storageRef = ref(storage, `cardImages/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);

    // Firestoreにカード情報を保存
    await addDoc(collection(db, 'tradeCards'), {
      name,
      hp: Number(hp),
      type,
      imageUrl,
      ownerId: user.uid,
      ownerName: user.displayName,
      createdAt: new Date(),
    });
    alert('カードを作成しました');
    router.push('/showCards'); // 作成後にカード一覧へ遷移
  };

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        戻る
      </button>
      <h1 className={styles.title}>カード新規作成</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          名前
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="カードの名前を入力"
          />
        </label>
        <label>
          HP
          <input
            type="number"
            value={hp}
            onChange={e => setHp(e.target.value)}
            placeholder="HPを入力"
            min="0"
          />
        </label>
        <label>
          タイプ
          <input
            type="text"
            value={type}
            onChange={e => setType(e.target.value)}
            placeholder="タイプを入力"
          />
        </label>
        <label>
          画像ファイル
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          カードを作成
        </button>
      </form>
    </div>
  );
};

export default CreateCard;
