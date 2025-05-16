import { db } from './firebase';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';

export const handleLike = async (currentUserId: string, userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', currentUserId);

    // 相手の likedBy に自分のIDを追加
    await setDoc(
      userRef,
      {
        likedBy: arrayUnion(currentUserId),
      },
      { merge: true } // 既存データを保持しつつ更新
    );

    // 自分の matches を更新
    await setDoc(
      currentUserRef,
      {
        matches: arrayUnion(userId),
      },
      { merge: true }
    );

    console.log('いいねを送りました！');
  } catch (error) {
    console.error('Error liking user:', error);
  }
};