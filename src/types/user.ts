import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  nickname: string;
  bio: string;
  height: number;
  bodyType: string;
  bloodType: string;
  residence: string;
  hometown: string;
  job: string;
  education: string;
  income: string;
  smoking: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likedBy: string[]; 
  matches: string[]; 
}
