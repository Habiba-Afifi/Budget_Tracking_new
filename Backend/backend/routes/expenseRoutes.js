const express = require('express');
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const router = express.Router();

router.post('/add', addExpense); // Add a new expense
router.get('/:userId', getExpenses); // Get all expenses for a user
router.put('/:id', updateExpense); // Update an expense
router.delete('/:id', deleteExpense); // Delete an expense

module.exports = router;