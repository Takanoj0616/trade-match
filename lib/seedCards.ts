import { db } from '../src/lib/firebase';// Firebase の初期化を行ったファイルをインポート
import { collection, addDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// JSON ファイルのパス
const filePath = path.resolve(__dirname, '../data/dummyCards.json');

// JSON ファイルを読み込む
const seedCards = async () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const cards = JSON.parse(data);

    const collectionRef = collection(db, 'cards'); // Firestore のコレクション名を指定

    for (const card of cards) {
      const docRef = await addDoc(collectionRef, card);
      console.log(`Added card: ${card.name} with ID: ${docRef.id}`);
    }

    console.log('All cards have been added successfully!');
  } catch (error) {
    console.error('Error seeding cards:', error);
  }
};

seedCards();