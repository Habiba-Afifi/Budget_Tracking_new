const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
  try {
    const { userID, income, expenses, categories } = req.body;

    if (expenses > income) {
      return res.status(400).json({ error: 'Expenses cannot exceed income.' });
    }

    const newBudget = new Budget({
      userID,
      income,
      expenses,
      categories,
    });

    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
exports.getBudget = async (req, res) => {
  try {
    const { userID } = req.params;

    const budget = await Budget.findOne({ userID });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found.' });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};