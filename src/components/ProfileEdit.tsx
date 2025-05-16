import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp, getDoc, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile } from '@/types/user';

const TAG_OPTIONS = ['アニメ', 'サウナ', 'カメラ', 'ゲーム', 'スポーツ', '旅行', '音楽'];

export default function ProfileEdit({ userId, ownedCards = 0, createdAt, lastLogin }: { userId: string, ownedCards?: number, createdAt?: any, lastLogin?: any }) {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
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

  // 既存プロフィール情報を取得してフォームにセット
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
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
    setProfile((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setProfile((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(e.target.files![0]),
      }));
    }
  };

  // カード画像アップロード
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

    // Firestoreにカード情報を追加（必要に応じて他の情報も追加）
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
    const updatedProfile: UserProfile = {
      id: userId,
      ...profile,
      avatarUrl,
      createdAt: createdAt || userDoc.data()?.createdAt || now,
      lastLogin: lastLogin || now,
      ownedCards,
    } as UserProfile;
    await setDoc(doc(db, 'users', userId), updatedProfile, { merge: true });
    alert('プロフィールを更新しました！');
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div>
        <label className="block mb-1 font-semibold">名前（ニックネーム）</label>
        <input
          type="text"
          value={profile.username}
          onChange={e => {
            setProfile({ ...profile, username: e.target.value });
            setUsernameError('');
          }}
          required
          className="w-full p-2 border rounded"
        />
        {usernameError && <div className="text-red-500 text-sm">{usernameError}</div>}
      </div>
      <div>
        <label className="block mb-1 font-semibold">趣味タグ</label>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map(tag => (
            <label key={tag} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={profile.tags?.includes(tag) || false}
                onChange={() => handleTagChange(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1 font-semibold">年齢</label>
        <input
          type="number"
          value={profile.age}
          onChange={e => setProfile({ ...profile, age: e.target.value })}
          min={0}
          max={120}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">性別</label>
        <select
          value={profile.gender}
          onChange={e => setProfile({ ...profile, gender: e.target.value })}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">選択してください</option>
          <option value="男性">男性</option>
          <option value="女性">女性</option>
          <option value="その他">その他</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">自己紹介</label>
        <textarea
          value={profile.bio}
          onChange={e => setProfile({ ...profile, bio: e.target.value })}
          minLength={20}
          maxLength={500}
          required
          className="w-full p-2 border rounded"
        />
        <div className="text-sm text-gray-500">{profile.bio?.length || 0}/500文字</div>
      </div>
      <div>
        <label className="block mb-1 font-semibold">プロフィール画像</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="w-full p-2 border rounded"
        />
        {profile.avatarUrl && (
          <img src={profile.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full mt-2" />
        )}
        {uploading && <div className="text-blue-500 text-sm">アップロード中...</div>}
      </div>
      <div>
        <label className="block mb-1 font-semibold">カード画像アップロード</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCardFileChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleCardUpload}
          disabled={cardUploading}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          {cardUploading ? 'アップロード中...' : 'カード画像をアップロード'}
        </button>
      </div>
      <div>
        <label className="block mb-1 font-semibold">カード所持数</label>
        <div className="p-2 border rounded bg-gray-100">{ownedCards ?? 0}枚</div>
      </div>
      <div>
        <label className="block mb-1 font-semibold">登録日</label>
        <div className="p-2 border rounded bg-gray-100">{createdAt ? new Date(createdAt.seconds * 1000).toLocaleDateString() : '-'}</div>
      </div>
      <div>
        <label className="block mb-1 font-semibold">最終ログイン</label>
        <div className="p-2 border rounded bg-gray-100">{lastLogin ? new Date(lastLogin.seconds * 1000).toLocaleString() : '-'}</div>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">保存</button>
    </form>
  );
}