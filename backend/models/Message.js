const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  wa_id: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  message_id: String,
  meta_msg_id: String,
  timestamp: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, default: 'text' },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent' 
  },
  profile_name: String,
  direction: { 
    type: String, 
    enum: ['incoming', 'outgoing'],
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
}, { 
  _id: false,
  collection: 'processed_messages' 
});

module.exports = mongoose.model('Message', messageSchema);