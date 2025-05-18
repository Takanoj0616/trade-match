import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp, getDoc, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile } from '@/types/user';
import styles from './ProfileEdit.module.css';

const TAG_OPTIONS = ['アニメ', 'サウナ', 'カメラ', 'ゲーム', 'スポーツ', '旅行', '音楽'];

export default function ProfileEdit({ userId, ownedCards = 0, createdAt, lastLogin }: { userId: string, ownedCards?: number, createdAt?: any, lastLogin?: any }) {
  const [profile, setProfile] = useState<any>({
    username: '',
    tags: [],
    age: '',
    gender: '',
    bio: '',
    avatarUrl: '',
  });
  const [usernameError, setUsernameError] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cardFile, setCardFile] = useState<File | null>(null);
  const [cardUploading, setCardUploading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data() as any;
        setProfile({
          username: data.username || '',
          tags: data.tags || [],
          age: data.age || '',
          gender: data.gender || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  const handleTagChange = (tag: string) => {
    setProfile((prev: any) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t: string) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setProfile((prev: any) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(e.target.files![0]),
      }));
    }
  };

  const handleCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCardFile(e.target.files[0]);
    }
  };

  const handleCardUpload = async () => {
    if (!cardFile) {
      alert('カード画像を選択してください');
      return;
    }
    setCardUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `userCards/${userId}_${Date.now()}_${cardFile.name}`);
    await uploadBytes(storageRef, cardFile);
    const imageUrl = await getDownloadURL(storageRef);
    await addDoc(collection(db, 'tradeCards'), {
      ownerId: userId,
      imageUrl,
      uploadedAt: Timestamp.now(),
    });
    setCardUploading(false);
    setCardFile(null);
    alert('カード画像をアップロードしました！');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.username && profile.username.length < 2) {
      setUsernameError('2文字以上で入力してください');
      return;
    }
    if (profile.bio && (profile.bio.length < 20 || profile.bio.length > 500)) {
      alert('自己紹介は20〜500文字で入力してください');
      return;
    }
    let avatarUrl = profile.avatarUrl || '';
    if (avatarFile) {
      setUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${userId}_${Date.now()}`);
      await uploadBytes(storageRef, avatarFile);
      avatarUrl = await getDownloadURL(storageRef);
      setUploading(false);
    }
    const now = Timestamp.now();
    const userDoc = await getDoc(doc(db, 'users', userId));
    const updatedProfile: any = {
      id: userId,
      ...profile,
      avatarUrl,
      createdAt: createdAt || userDoc.data()?.createdAt || now,
      lastLogin: lastLogin || now,
      ownedCards,
    };
    await setDoc(doc(db, 'users', userId), updatedProfile, { merge: true });
    alert('プロフィールを更新しました！');
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className={styles.profileEditRoot}>
      <form onSubmit={handleSubmit} className={styles.profileEditForm}>
        <div className={styles.profileEditHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="avatar" className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarPlaceholder}>No Image</div>
              )}
              <input type="file" accept="image/*" onChange={handleAvatarChange} className={styles.avatarInput} />
              {uploading && <div className={styles.uploadingText}>アップロード中...</div>}
            </div>
            <div className={styles.usernameSection}>
              <input
                type="text"
                value={profile.username}
                onChange={e => {
                  setProfile({ ...profile, username: e.target.value });
                  setUsernameError('');
                }}
                required
                className={styles.input}
                placeholder="ニックネーム"
              />
              {usernameError && <div className={styles.errorText}>{usernameError}</div>}
            </div>
          </div>
        </div>
        <div className={styles.profileEditBody}>
          <div className={styles.leftCol}>
            <div className={styles.sectionCard}>
              <label className={styles.label}>趣味タグ</label>
              <div className={styles.tagList}>
                {TAG_OPTIONS.map(tag => (
                  <label
                    key={tag}
                    className={
                      profile.tags?.includes(tag)
                        ? `${styles.tagItem} ${styles.tagItemSelected}`
                        : styles.tagItem
                    }
                  >
                    <input
                      type="checkbox"
                      checked={profile.tags?.includes(tag) || false}
                      onChange={() => handleTagChange(tag)}
                      style={{ display: 'none' }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.sectionCard}>
              <label className={styles.label}>自己紹介</label>
              <textarea
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                minLength={20}
                maxLength={500}
                required
                className={styles.textarea}
                placeholder="自己紹介を入力してください（20〜500文字）"
                rows={5}
              />
              <div className={styles.charCount}>{profile.bio?.length || 0}/500文字</div>
            </div>
            <div className={styles.sectionCard}>
              <label className={styles.label}>カード画像アップロード</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCardFileChange}
                className={styles.input}
              />
              <button
                type="button"
                onClick={handleCardUpload}
                disabled={cardUploading}
                className={styles.uploadButton}
              >
                {cardUploading ? 'アップロード中...' : 'カード画像をアップロード'}
              </button>
            </div>
          </div>
          <div className={styles.rightCol}>
            <div className={styles.sectionCard}>
              <label className={styles.label}>年齢</label>
              <input
                type="number"
                value={profile.age}
                onChange={e => setProfile({ ...profile, age: e.target.value })}
                min={0}
                max={120}
                required
                className={styles.input}
                placeholder="例：25"
              />
            </div>
            <div className={styles.sectionCard}>
              <label className={styles.label}>性別</label>
              <select
                value={profile.gender}
                onChange={e => setProfile({ ...profile, gender: e.target.value })}
                required
                className={styles.input}
              >
                <option value="">選択してください</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div className={styles.sectionCard}>
              <label className={styles.label}>カード所持数</label>
              <div className={styles.infoBox}>{ownedCards ?? 0}枚</div>
            </div>
            <div className={styles.sectionCard}>
              <label className={styles.label}>登録日</label>
              <div className={styles.infoBox}>{createdAt ? new Date(createdAt.seconds * 1000).toLocaleDateString() : '-'}</div>
            </div>
            <div className={styles.sectionCard}>
              <label className={styles.label}>最終ログイン</label>
              <div className={styles.infoBox}>{lastLogin ? new Date(lastLogin.seconds * 1000).toLocaleString() : '-'}</div>
            </div>
          </div>
        </div>
        <button type="submit" className={styles.saveButton}>保存</button>
      </form>
    </div>
  );
}