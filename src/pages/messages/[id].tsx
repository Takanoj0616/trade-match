import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

const MessagesPage = () => {
  const router = useRouter();
  const { id } = router.query; // マッチング相手のID
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('user1', 'in', [id]));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = collection(db, 'messages');
    await addDoc(messagesRef, {
      user1: id,
      text: newMessage,
      timestamp: new Date(),
    });

    setNewMessage('');
  };

  return (
    <div>
      <h1>メッセージ</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.text}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="メッセージを入力"
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
};

export default MessagesPage;