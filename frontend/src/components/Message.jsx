import { format } from 'date-fns';

function Message({ message, isOutgoing }) {
  const statusIcons = {
    sent: '✓',
    delivered: '✓✓',
    read: '✓✓✓',
    sending: '⌛',
    failed: '⚠️'
  };

  return (
    <div className={`message ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      <div className="message-content">
        <p>{message.text}</p>
        <div className="message-meta">
          <span className="timestamp">
            {format(new Date(message.timestamp * 1000), 'HH:mm')}
          </span>
          {isOutgoing && (
            <span className={`status ${message.status}`}>
              {statusIcons[message.status]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;