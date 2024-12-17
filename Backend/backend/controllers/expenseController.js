const Expense = require('../models/expense');

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { userId, category, description, amount, date, isRecurring } = req.body;
    const newExpense = new Expense({ userId, category, description, amount, date, isRecurring });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error });
  }
};

// Get all expenses for a user
exports.getExpenses = async (req, res) => {
  const { userId } = req.params;
  try {
    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
};

// Edit an existing expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const expense = await Expense.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
};