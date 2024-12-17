const Goal = require('../models/goal');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const { userId, title, description, targetAmount, savedAmount, deadline } = req.body;

    // Initialize the goal with progress calculation in pre-save hook
    const newGoal = new Goal({
      userId,
      title,
      description,
      targetAmount,
      savedAmount,
      deadline
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error });
  }
};


// Get all goals for a user
exports.getGoalsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = await Goal.find({ userId });
    res.status(200).json(goals); // Progress will be included
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
};