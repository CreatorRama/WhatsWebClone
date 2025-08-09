require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const processWebhook = require('./services/webhookProcessor');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for data loading'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Load and process all sample payloads
async function loadData() {
  const samplesDir = path.join(__dirname, 'sample_payloads');
  
  try {
    const files = fs.readdirSync(samplesDir)
      .filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(samplesDir, file);
      const payload = JSON.parse(fs.readFileSync(filePath));
      
      console.log(`Processing ${file}...`);
      await processWebhook(payload);
    }
    
    console.log('All sample data loaded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error loading sample data:', err);
    process.exit(1);
  }
}

loadData();