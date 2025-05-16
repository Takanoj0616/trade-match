import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Image from 'next/image';

const TAG_OPTIONS = ['アニメ', 'サウナ', 'カメラ', 'ゲーム', 'スポーツ', '旅行', '音楽'];

type UserProfile = {
  id: string;
  username: string;
  tags: string[];
  age: number | string;
  gender: string;
  bio: string;
  avatarUrl: string;
  location?: string;
  likes?: number;
};

const UsersPage = ({ currentUserId }: { currentUserId: string }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, 'users'));
      // 自分以外のユーザーのみ
      const userList = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as UserProfile))
        .filter(user => user.id !== currentUserId);
      setUsers(userList);
      setLoading(false);

      const usersCollectionRef = collection(db, 'users');
      for (const user of userList) {
        if (!user.username) continue; // usernameが空ならスキップ
        await addDoc(usersCollectionRef, user);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  if (loading) return <div>読み込み中...</div>;

  return (
    <div>
      <h1>お相手一覧</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-8 p-4 border rounded-lg flex gap-4 items-center">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image
                src={user.avatarUrl && user.avatarUrl !== '' ? user.avatarUrl : '/dummy.png'}
                alt={user.username}
                width={96}
                height={96}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div className="text-sm text-gray-600">{user.username}</div>
              <div className="text-sm text-gray-600">年齢: {user.age}</div>
              <div className="text-sm text-gray-600">性別: {user.gender}</div>
              <div className="text-sm text-gray-600">
                趣味: {user.tags && user.tags.length > 0 ? user.tags.join(', ') : '未設定'}
              </div>
              <div className="text-sm mt-1">自己紹介: {user.bio}</div>
            </div>
            <button
              onClick={() => {/* ここでhandleLike(currentUserId, user.id)などを呼び出し */}}
              className="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              いいね
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;