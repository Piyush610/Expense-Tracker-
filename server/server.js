const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// ================== MIDDLEWARE ==================

// ✅ CORS (safe + works in production)
app.use(cors({
  origin: true, // allow all origins (fixes Render issues)
  credentials: true,
}));

app.use(express.json());

// ================== ROUTES ==================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));

// ================== SERVE FRONTEND ==================

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();

  const clientDistPath = path.join(__dirname, 'client', 'dist');

  // Serve static files
  app.use(express.static(clientDistPath));

  // React routing fix
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) =>
    res.json({ message: 'Expense Tracker API is running 🚀' })
  );
}

// ================== ERROR HANDLER ==================

app.use(errorHandler);

// ================== DB + SERVER ==================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });