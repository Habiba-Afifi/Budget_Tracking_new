const express = require('express');
const {
  createGoal,
  getGoalsByUser,
  updateGoalProgress
} = require('../controllers/goalController');

const router = express.Router();

// Routes for goal management
router.post('/create', createGoal);
router.get('/:userId', getGoalsByUser);
router.put('/:goalId/progress', updateGoalProgress); // New route for updating progress


module.exports = router;
