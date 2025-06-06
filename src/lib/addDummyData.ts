import { db } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore';

const addDummyData = async () => {
  const dummyData = [
    { name: 'Alice', age: 25, interests: ['music', 'travel'], location: 'Tokyo', likes: 0 },
    { name: 'Bob', age: 30, interests: ['sports', 'movies'], location: 'Osaka', likes: 0 },
    { name: 'Bob', age: 30, interests: ['sports', 'movies'], location: 'Osaka', likes: 0 },
    { name: 'Charlie', age: 28, interests: ['reading', 'gaming'], location: 'Nagoya', likes: 0 },
    { name: 'Diana', age: 22, interests: ['art', 'fashion'], location: 'Kyoto', likes: 0 },
    { name: 'Eve', age: 27, interests: ['technology', 'fitness'], location: 'Fukuoka', likes: 0 },
    { name: 'Frank', age: 35, interests: ['cooking', 'hiking'], location: 'Sapporo', likes: 0 },
    { name: 'Grace', age: 29, interests: ['photography', 'yoga'], location: 'Kobe', likes: 0 },
    { name: 'Hank', age: 31, interests: ['cycling', 'music'], location: 'Sendai', likes: 0 },
    { name: 'Ivy', age: 24, interests: ['dancing', 'travel'], location: 'Hiroshima', likes: 0 },
    { name: 'Jack', age: 26, interests: ['movies', 'sports'], location: 'Yokohama', likes: 0 },
  ];

  try {
    const collectionRef = collection(db, 'users'); 
    for (const user of dummyData) {
      await addDoc(collectionRef, user);
      console.log(`Added user: ${user.name}`);
    }
    console.log('Dummy data added successfully!');
  } catch (error) {
    console.error('Error adding dummy data:', error);
  }
};

addDummyData();