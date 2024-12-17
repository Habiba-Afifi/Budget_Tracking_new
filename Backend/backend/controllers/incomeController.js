// controllers/incomeController.js
const Income = require('../models/income');

// Add a new income source
exports.addIncome = async (req, res) => {
  try {
    const { userId, sourceName, amount } = req.body;
    const newIncome = new Income({ userId, sourceName, amount });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: 'Error adding income source', error });
  }
};

// Get all income sources for a user
exports.getIncome = async (req, res) => {
  const { userId } = req.params;

  try {
    const incomeSources = await Income.find({ userId });
    if (!incomeSources.length) {
      return res.status(404).json({ message: 'No income sources found' });
    }
    res.status(200).json(incomeSources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching income sources', error });
  }
};

// Edit an income source
exports.editIncome = async (req, res) => {
  const { incomeId } = req.params;
  const { sourceName, amount } = req.body;

  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      incomeId,
      { sourceName, amount },
      { new: true }
    );
    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income source not found' });
    }
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: 'Error updating income source', error });
  }
};
// Delete an income source
exports.deleteIncome = async (req, res) => {
  const { incomeId } = req.params;

  if (!incomeId) {
    return res.status(400).json({ message: 'Income ID is required' });
  }

  try {
    const deletedIncome = await Income.findByIdAndDelete(incomeId);

    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income source not found' });
    }

    res.status(200).json({ message: 'Income source deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting income source', error });
  }
};

// Get total income for a user
exports.getTotalIncome = async (req, res) => {
  const { userId } = req.params;

  try {
    const totalIncome = await Income.aggregate([
      { $match: { userId } }, // Filter by user ID
      { $group: { _id: null, total: { $sum: '$amount' } } } // Sum all amounts
    ]);

    if (!totalIncome.length) {
      return res.status(404).json({ message: 'No income sources found' });
    }

    res.status(200).json({ totalIncome: totalIncome[0].total });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating total income', error });
  }
};