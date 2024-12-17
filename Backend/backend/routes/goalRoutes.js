const express = require('express');
const {
  createGoal,
  getGoalsByUser,
  updateGoalSavedAmount
} = require('../controllers/goalController');

const router = express.Router();

// Routes for goal management
router.post('/create', createGoal);
router.get('/:userId', getGoalsByUser);

module.exports = router;