import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import styles from '@/styles/messages.module.css';

type Message = {
  id: string;
  text: string;
  senderId: string;
  chatMembers: string[];
  timestamp: Date;
  isSent: boolean;
};

const MessagesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUserId = "currentUser123"; // 現在のユーザーID（仮置き）

  useEffect(() => {
    if (!id) return;
    const chatMembers = [currentUserId, id].sort();
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatMembers', '==', chatMembers),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        isSent: doc.data().senderId === currentUserId
      })) as Message[];
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [id, currentUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !id) return;
    const chatMembers = [currentUserId, id].sort();
    const messagesRef = collection(db, 'messages');
    await addDoc(messagesRef, {
      senderId: currentUserId,
      chatMembers,
      text: newMessage.trim(),
      timestamp: new Date(),
    });
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/matches" className={styles.backButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        戻る
      </Link>
      <h1 className={styles.title}>メッセージ</h1>
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.isSent ? styles.sent : styles.received}`}
          >
            <div>{msg.text}</div>
            <div className={styles.messageTime}>
              {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="メッセージを入力"
          className={styles.messageInput}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className={styles.sendButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          送信
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;