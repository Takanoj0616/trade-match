import { db } from '../src/lib/firebase'; // Firebase の初期化を行ったファイルをインポート
import { collection, addDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// JSON ファイルのパス
const cardsFilePath = path.resolve(__dirname, '../data/dummyCards.json');
const usersFilePath = path.resolve(__dirname, '../data/dummyDtata.json'); // 追加

const seedCardsAndUsers = async () => {
  try {
    // カードデータ投入
    const cardsData = fs.readFileSync(cardsFilePath, 'utf-8');
    const cards = JSON.parse(cardsData);
    const cardsCollectionRef = collection(db, 'cards');
    for (const card of cards) {
      const docRef = await addDoc(cardsCollectionRef, card);
      console.log(`Added card: ${card.name || card.id} with ID: ${docRef.id}`);
    }
    console.log('All cards have been added successfully!');

    // ユーザーデータ投入
    const usersData = fs.readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);
    const usersCollectionRef = collection(db, 'users');
    for (const user of users) {
      const docRef = await addDoc(usersCollectionRef, user);
      console.log(`Added user: ${user.username} with ID: ${docRef.id}`);
    }
    console.log('All users have been added successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedCardsAndUsers();