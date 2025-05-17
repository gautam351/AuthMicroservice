const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const AuthRoutes = require('./Routes/AuthRoutes');
const dbInstance = require('./DB/Database');

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware (only use one)
app.use(express.json()); // This is important for parsing JSON bodies
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api', AuthRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
