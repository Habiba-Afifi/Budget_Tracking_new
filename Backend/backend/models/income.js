// models/income.js
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sourceName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;