require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Cache MongoDB connection across serverless invocations
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('MongoDB connected');
}

// Ensure DB is connected before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/savings',  require('./routes/savings'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Export for Vercel (serverless)
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
    .catch(err => { console.error(err.message); process.exit(1); });
}
