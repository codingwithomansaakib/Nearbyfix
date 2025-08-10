require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();


// ✅ 1. Connect to MongoDB
mongoose.set('debug', true);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ 2. CORS config
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));



// ✅ 3. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 4. Routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const contactRoutes = require('./routes/contact');
const loginRoutes = require('./routes/login');
const webhookRoutes = require('./routes/webhook');

app.use('/api', webhookRoutes);
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api', contactRoutes);

app.use('/', loginRoutes);


app.get('/', (req, res) => {
  res.send('API is working!');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


// ✅ 5. Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});





