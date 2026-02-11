const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection (Placeholder for now)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/docugithub';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('DocuGithub Backend is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MERN Stack Ready' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
