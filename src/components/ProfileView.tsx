'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '@/types/user';
import styles from './ProfileView.module.css';

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
    <div className={styles.profileViewContainer}>
      <h2 className={styles.profileViewTitle}>プロフィール</h2>
      <div className={styles.avatarContainer}>
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="プロフィール画像" className={styles.avatarImg} />
        ) : (
          <div className={styles.avatarPlaceholder}>画像なし</div>
        )}
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.infoItem}><span className={styles.infoLabel}>名前：</span>{profile.username}</div>
        <div className={styles.infoItem}><span className={styles.infoLabel}>年齢：</span>{profile.age}</div>
        <div className={styles.infoItem}><span className={styles.infoLabel}>性別：</span>{getGenderLabel(profile.gender)}</div>
        <div className={styles.infoItem}><span className={styles.infoLabel}>自己紹介：</span>{profile.bio}</div>
      </div>
    </div>
  );
}