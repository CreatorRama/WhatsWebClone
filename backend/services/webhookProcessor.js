const Message = require('../models/Message');

async function processWebhook(payload) {
  if (payload.payload_type !== 'whatsapp_webhook') {
    throw new Error('Invalid payload type');
  }

  const entry = payload.metaData.entry[0];
  const changes = entry.changes[0];
  
  if (!changes || changes.field !== 'messages') {
    return; 
  }

  const value = changes.value;

  
  if (value.messages && value.messages.length > 0) {
    const contact = value.contacts[0];
    const message = value.messages[0];

    const messageData = {
      _id: payload._id,
      wa_id: contact.wa_id,
      from: message.from,
      to: value.metadata.phone_number_id,
      message_id: message.id,
      meta_msg_id: message.id,
      timestamp: message.timestamp,
      text: message.text?.body || '[media message]',
      type: message.type,
      status: 'sent', 
      profile_name: contact.profile?.name || 'Unknown',
      direction: 'incoming'
    };

    await Message.findOneAndUpdate(
      { _id: payload._id },
      messageData,
      { upsert: true, new: true }
    );
  }

  
  if (value.statuses && value.statuses.length > 0) {
    const status = value.statuses[0];
    
    await Message.updateOne(
      { meta_msg_id: status.meta_msg_id || status.id },
      { $set: { status: status.status } }
    );
  }
}

module.exports = processWebhook;