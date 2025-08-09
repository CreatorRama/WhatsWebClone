import { format } from 'date-fns';

function ChatList({ conversations, onSelect, loading }) {
  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Chats</h2>
      </div>
      {loading ? (
        <div className="loading">Loading conversations...</div>
      ) : (
        <div className="conversations">
          {conversations.map(conv => (
            <div 
              key={conv.wa_id} 
              className="conversation-item"
              onClick={() => onSelect(conv)}
            >
              <div className="avatar">{conv.profile_name.charAt(0)}</div>
              <div className="conversation-details">
                <div className="conversation-header">
                  <span className="contact-name">{conv.profile_name}</span>
                  <span className="message-time">
                    {format(new Date(conv.lastMessage.timestamp * 1000), 'HH:mm')}
                  </span>
                </div>
                <p className="last-message">
                  {conv.lastMessage.direction === 'outgoing' 
                    ? `You: ${conv.lastMessage.text}` 
                    : conv.lastMessage.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;