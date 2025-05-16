import { db } from './firebase';
import { collection, getDocs, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ユーザー一覧を取得
export const getUsers = async () => {
  const users: any[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
  return users;
};

// いいね処理
export const handleLike = async (userId: string) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('ログインしていません');
    }

    const currentUserId = currentUser.uid;

    const userRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', currentUserId);

    // 相手の likedBy に自分のIDを追加
    await setDoc(
      userRef,
      {
        likedBy: arrayUnion(currentUserId),
      },
      { merge: true }
    );

    // 自分の matches を更新
    await setDoc(
      currentUserRef,
      {
        matches: arrayUnion(userId),
      },
      { merge: true }
    );

    alert('いいねを送りました！');
  } catch (error) {
    console.error('Error liking user:', error);
  }
};