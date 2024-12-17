const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  progress: { type: Number, default: 0 } 
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;