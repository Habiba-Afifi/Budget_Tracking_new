const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  isRecurring: { type: Boolean, default: false },
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;