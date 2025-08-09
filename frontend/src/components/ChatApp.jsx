import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';


function ChatApp() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/conversations');
        setConversations(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/messages/${selectedChat.wa_id}`);
          setMessages(res.data);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
      fetchMessages();
    }
  }, [selectedChat]);

 const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedChat) return;
    
    const tempId = Date.now().toString();
    const newMessage = {
      _id: tempId,
      wa_id: selectedChat.wa_id,
      text,
      status: 'sending',
      direction: 'outgoing',
      timestamp: Math.floor(Date.now() / 1000),
    };

    // Update both messages and conversations immediately
    setMessages(prev => [...prev, newMessage]);
    setConversations(prev => prev.map(conv => 
      conv.wa_id === selectedChat.wa_id
        ? {
            ...conv,
            lastMessage: {
              ...newMessage,
              text: newMessage.text,
              timestamp: newMessage.timestamp,
              status: 'sent',
              direction: 'outgoing'
            }
          }
        : conv
    ));

    try {
      const res = await axios.post('http://localhost:5000/api/messages', {
        wa_id: selectedChat.wa_id,
        text
      });
      
      // Update with final message from server
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? res.data : msg
      ));
      setConversations(prev => prev.map(conv => 
        conv.wa_id === selectedChat.wa_id
          ? {
              ...conv,
              lastMessage: {
                ...res.data,
                text: res.data.text,
                timestamp: res.data.timestamp,
                status: res.data.status,
                direction: res.data.direction
              }
            }
          : conv
      ));
    } catch (err) {
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? {...msg, status: 'failed'} : msg
      ));
      setConversations(prev => prev.map(conv => 
        conv.wa_id === selectedChat.wa_id
          ? {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                status: 'failed'
              }
            }
          : conv
      ));
    }
  };
  return (
    <div className="chat-app">
      <ChatList 
        conversations={conversations} 
        onSelect={setSelectedChat}
        loading={loading}
      />
      {selectedChat ? (
        <ChatWindow 
          contact={selectedChat} 
          messages={messages}
          onSend={handleSendMessage}
        />
      ) : (
        <div className="empty-chat">
          <div className="empty-content">
            <h2>WhatsApp Web Clone</h2>
            <p>Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatApp;