require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool } = require('./config/db');

// Route Imports
const authRoutes = require('./src/routes/auth.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const authMiddleware = require('./src/middlewares/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Keep for dev, but now we also serve same-origin
    credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/insights', authMiddleware, require('./src/routes/insight.routes'));
app.use('/api/categories', authMiddleware, require('./src/routes/category.routes'));

// Serve Static Frontend (Production-like)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React Routing (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    // Test DB Connection
    pool.query('SELECT 1').then(() => {
        console.log('Database Connected to SQLite');
    }).catch(err => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit if DB fails
    });
});
