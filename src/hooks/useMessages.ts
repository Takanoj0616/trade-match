import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Message } from '@/types';
import { useAuth } from './useAuth';

export const useMessages = (chatPartnerId: string | string[] | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !chatPartnerId) return;

    const currentUserId = user.uid;
    const partnerId = Array.isArray(chatPartnerId) ? chatPartnerId[0] : chatPartnerId; // idが配列の場合を考慮
    const chatMembers = [currentUserId, partnerId].sort();

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
      })) as Message[]; // 型アサーションを維持
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatPartnerId, user]); // userを追加

  const sendMessage = async (text: string) => {
    if (!user || !chatPartnerId || !text.trim()) return;

    const currentUserId = user.uid;
    const partnerId = Array.isArray(chatPartnerId) ? chatPartnerId[0] : chatPartnerId;
    const chatMembers = [currentUserId, partnerId].sort();

    const messagesRef = collection(db, 'messages');
    await addDoc(messagesRef, {
      senderId: currentUserId,
      chatMembers,
      text: text.trim(),
      timestamp: new Date(),
    });
  };

  return { messages, sendMessage, user };
}; 