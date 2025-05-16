'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Auth from '@/components/Auth';
import ProfileEdit from '@/components/ProfileEdit';

export default function EditPage() {
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">プロフィール編集</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            ホームへ戻る
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <ProfileEdit userId={user.uid} />
      </main>
    </div>
  );
} 