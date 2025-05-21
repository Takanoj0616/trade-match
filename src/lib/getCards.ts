import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { CardData } from '@/types/card';

export const getCards = async (): Promise<CardData[]> => {
  try {
    const cardsCollection = collection(db, 'cards');
    const cardsSnapshot = await getDocs(cardsCollection);
    
    const cards: CardData[] = [];
    cardsSnapshot.forEach((doc) => {
      const data = doc.data();
      cards.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        cost: data.cost,
        type: data.type,
        rarity: data.rarity,
        imageUrl: data.imageUrl,
        attack: data.attack,
        health: data.health,
      });
    });

    return cards;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw new Error('Failed to fetch cards');
  }
}; 