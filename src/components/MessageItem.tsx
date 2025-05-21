import React from 'react';
import styles from '@/styles/messages.module.css';
import { Message } from '@/types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div
      key={message.id}
      className={`${styles.message} ${message.isSent ? styles.sent : styles.received}`}
    >
      <div>{message.text}</div>
      <div className={styles.messageTime}>
        {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default MessageItem; 