const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: Date,
  userId: String, // Add this line to link expenses to users
});

module.exports = mongoose.model('Expense', expenseSchema);
