const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: 0,
    },
    month: {
      type: Number, // 1-12
      required: true,
      default: () => new Date().getMonth() + 1,
    },
    year: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

// Unique budget for a user's category in a specific month
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
