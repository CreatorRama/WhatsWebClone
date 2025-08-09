const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Message = require('./models/Message'); // Correct import name
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      { 
        $group: { 
          _id: '$wa_id', 
          lastMessage: { $first: '$$ROOT' },
          profile_name: { $first: '$profile_name' },
          businessNumber: { $first: '$to' }
        }
      },
      { 
        $project: { 
          wa_id: '$_id',
          profile_name: 1,
          businessNumber: 1,
          lastMessage: {
            text: '$lastMessage.text',
            timestamp: '$lastMessage.timestamp',
            status: '$lastMessage.status',
            direction: '$lastMessage.direction'
          },
          _id: 0
        }
      }
    ]);
    res.json(conversations);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/messages/:wa_id', async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { wa_id, text } = req.body;
    
    // Find the conversation to get the original profile_name
    const conversation = await Message.findOne({ wa_id })
      .sort({ timestamp: -1 });
    
    const newMessage = {
      _id: new mongoose.Types.ObjectId().toString(),
      wa_id,
      from: '918329446654', // Business number
      to: wa_id, // Recipient
      message_id: `demo-${Date.now()}`,
      meta_msg_id: `demo-${Date.now()}`,
      timestamp: Math.floor(Date.now() / 1000),
      text,
      type: 'text',
      status: 'sent',
      profile_name: conversation?.profile_name || 'Customer', // Preserve original name
      direction: 'outgoing',
      createdAt: new Date()
    };
    
    await Message.create(newMessage);
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));