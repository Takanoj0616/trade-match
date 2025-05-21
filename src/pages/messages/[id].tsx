import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/messages.module.css';
import { useMessages } from '@/hooks/useMessages';
import MessageItem from '@/components/MessageItem';
import MessageInput from '@/components/MessageInput';

const MessagesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { messages, sendMessage, user } = useMessages(id);

  if (!user) {
    return <div>ログインしてください</div>;
  }

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
          <MessageItem key={msg.id} message={msg} />
        ))}
      </div>
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default MessagesPage;