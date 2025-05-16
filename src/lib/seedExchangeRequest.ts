import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import dummyCards from '../../data/dummyCards.json';

// Firebase設定（既存のfirebase.tsを使う場合はimport { db } from '../lib/firebase'; でOK）
import { db } from './firebase';

// ダミーユーザー情報（適宜変更してください）
const dummyUsers = [
  { uid: 'user1', name: 'たか' },
  { uid: 'user2', name: 'さとし' }
];

const seed = async () => {
  for (let i = 0; i < dummyCards.length; i++) {
    const card = dummyCards[i];
    // 交互に出品者を変える例
    const fromUser = dummyUsers[i % dummyUsers.length];
    const toUser = dummyUsers[(i + 1) % dummyUsers.length];

    await addDoc(collection(db, 'exchangeRequests'), {
      cardName: card.name,
      cardId: `dummy-card-${i}`,
      fromUserId: fromUser.uid,
      fromUserName: fromUser.name,
      toUserId: toUser.uid,
      toUserName: toUser.name,
      message: `ダミーメッセージ${i + 1}`,
      createdAt: serverTimestamp(),
    });
    console.log(`exchangeRequest added: ${card.name}`);
  }
};

seed().then(() => {
  console.log('シード完了');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});