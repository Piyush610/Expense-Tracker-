const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get all budgets for a user for the current month
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const budgets = await Budget.find({ user: req.user._id, month, year });

  // Add spent amount for each budget category
  const results = await Promise.all(
    budgets.map(async (b) => {
      const spent = await Transaction.aggregate([
        { 
          $match: { 
            user: req.user._id, 
            category: b.category, 
            type: 'expense',
            date: {
              $gte: new Date(year, month - 1, 1),
              $lt: new Date(year, month, 1)
            }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      return { ...b._doc, spent: spent[0]?.total || 0 };
    })
  );

  res.json(results);
});

// @desc    Upsert budget (create or update)
// @route   POST /api/budgets
// @access  Private
const upsertBudget = asyncHandler(async (req, res) => {
  const { category, amount } = req.body;
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category, month, year },
    { amount },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json(budget);
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  if (budget.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await budget.deleteOne();
  res.json({ message: 'Budget removed' });
});

module.exports = {
  getBudgets,
  upsertBudget,
  deleteBudget,
};
