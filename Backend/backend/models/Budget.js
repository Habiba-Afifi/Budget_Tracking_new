const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  categoryLimit: { type: Number, required: true },
});

const BudgetSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  income: { type: Number, required: true },
  expenses: { type: Number, required: true },
  categories: [CategorySchema],
});

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;