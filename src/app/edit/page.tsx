'use client';

import ProfileEdit from "@/components/ProfileEdit";
import { auth } from "@/lib/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function EditProfilePage() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  if (!user) {
    return <div>ログインが必要です。</div>;
  }

  return <ProfileEdit userId={user.uid} />;
} 