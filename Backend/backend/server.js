const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const budgetRoutes = require('./routes/budgetRoutes');  // Budget-related routes
const expenseRoutes = require('./routes/expenseRoutes'); // Expense-related routes
const incomeRoutes = require('./routes/incomeRoutes');   // Income-related routes
const goalRoutes = require('./routes/goalRoutes');
const authRoutes = require('./routes/authRoutes');


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Route Handlers
app.use('/api/budget', budgetRoutes);    // Budget-related API
app.use('/api/expenses', expenseRoutes); // Expense-related API
app.use('/api/income', incomeRoutes);    // Income-related API
app.use('/api/goals', goalRoutes);
app.use('/api/auth', authRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });
