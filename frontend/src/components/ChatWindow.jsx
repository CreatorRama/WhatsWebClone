import { useEffect, useRef } from 'react';
import UserHeader from './UserHeader';
import Message from './Message';
import MessageInput from './MessageInput';

function ChatWindow({ contact, messages, onSend }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-window">
      <UserHeader contact={contact} />
      
      <div className="message-list">
        {messages.map(message => (
          <Message 
            key={message._id} 
            message={message}
            isOutgoing={message.direction === 'outgoing'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput onSend={onSend} />
    </div>
  );
}

export default ChatWindow;