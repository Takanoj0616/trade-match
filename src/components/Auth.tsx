import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      if (!name || !gender || !age || !bio) {
        alert('名前、性別、年齢、自己紹介は必須です');
        return;
      }
    }
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          nickname: name,
          gender,
          age: Number(age),
          bio,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }, { merge: true });
      }
    } catch (error: unknown) {
      let message = '認証エラーが発生しました。';
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = (error as { code: string }).code;
        if (code === 'auth/invalid-credential') {
          message = isLogin ? 'メールアドレスまたはパスワードが間違っています。' : 'このメールアドレスはすでに登録されています。';
        } else if (code === 'auth/weak-password') {
          message = 'パスワードは6文字以上で入力してください。';
        }
      }
      alert(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isLogin ? 'ログイン' : '新規登録'}</h2>
      <form onSubmit={handleAuth}>
        {!isLogin && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">性別</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">選択してください</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">年齢</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2 border rounded"
                min="18"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">自己紹介</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isLogin ? 'ログイン' : '新規登録'}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
      </button>
    </div>
  );
}
