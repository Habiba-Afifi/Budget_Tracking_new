const express = require('express');

const { addIncome, getIncome, editIncome, getTotalIncome, deleteIncome} = require('../controllers/incomeController');
const router = express.Router();

// Add a new income source
router.post('/add', addIncome);

// Get all income sources for a user
router.get('/:userId', getIncome);

// Get total income for a user
router.get('/:userId/total', getTotalIncome);

// Edit an income source
router.put('/:incomeId/edit', editIncome);
// Delete an income source
router.delete('/:incomeId', deleteIncome);

module.exports = router;