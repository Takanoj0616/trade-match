'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '@/types/user';

function getGenderLabel(gender: string) {
  if (gender === 'male') return '男性';
  if (gender === 'female') return '女性';
  if (gender === 'other') return 'その他';
  return '';
}

export default function ProfileView({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
    };
    fetchProfile();
  }, [userId]);

  if (!profile) return <div>プロフィール情報を読み込み中...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">プロフィール</h2>
      <div><span className="font-semibold">名前：</span>{profile.nickname}</div>
      <div><span className="font-semibold">年齢：</span>{profile.age}</div>
      <div><span className="font-semibold">性別：</span>{getGenderLabel(profile.gender)}</div>
      <div><span className="font-semibold">自己紹介：</span>{profile.bio}</div>
    </div>
  );
}