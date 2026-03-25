const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');

// @desc    Get all transactions (with filter, search, pagination)
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query;

  const query = { user: req.user._id };

  if (type && type !== 'all') query.type = type;
  if (category && category !== 'all') query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate && startDate.trim() !== '') {
      const date = new Date(startDate);
      if (!isNaN(date)) query.date.$gte = date;
    }
    if (endDate && endDate.trim() !== '') {
      const date = new Date(endDate);
      if (!isNaN(date)) query.date.$lte = date;
    }
    // Remove if empty
    if (Object.keys(query.date).length === 0) delete query.date;
  }
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const total = await Transaction.countDocuments(query);
  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  res.json({
    transactions,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// @desc    Get dashboard summary (totals + chart data)
// @route   GET /api/transactions/summary
// @access  Private
const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Total income, expenses, balance
  const totals = await Transaction.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  let income = 0;
  let expense = 0;
  totals.forEach((t) => {
    if (t._id === 'income') income = t.total;
    if (t._id === 'expense') expense = t.total;
  });

  // Monthly data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const monthly = await Transaction.aggregate([
    { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Category breakdown (expenses only)
  const byCategory = await Transaction.aggregate([
    { $match: { user: userId, type: 'expense' } },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
    { $sort: { total: -1 } },
  ]);

  // Trend calculations (MoM)
  const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const endOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

  const currentMonthData = await Transaction.aggregate([
    { $match: { user: userId, date: { $gte: startOfCurrentMonth } } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } }
  ]);

  const lastMonthData = await Transaction.aggregate([
    { $match: { user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } }
  ]);

  const getVal = (arr, type) => arr.find(d => d._id === type)?.total || 0;
  
  const trends = {
    income: {
      current: getVal(currentMonthData, 'income'),
      last: getVal(lastMonthData, 'income'),
    },
    expense: {
      current: getVal(currentMonthData, 'expense'),
      last: getVal(lastMonthData, 'expense'),
    }
  };

  res.json({
    balance: income - expense,
    income,
    expense,
    monthly,
    byCategory,
    trends,
  });
});

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { title, amount, type, category, date, note } = req.body;

  if (!title || !amount || !type || !category) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const transaction = await Transaction.create({
    user: req.user._id,
    title,
    amount,
    type,
    category,
    date: date || Date.now(),
    note,
  });

  res.status(201).json(transaction);
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this transaction');
  }

  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this transaction');
  }

  await transaction.deleteOne();
  res.json({ message: 'Transaction deleted', id: req.params.id });
});

// @desc    Export transactions as CSV
// @route   GET /api/transactions/export
// @access  Private
const exportCSV = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });

  const fields = ['title', 'amount', 'type', 'category', 'date', 'note'];
  const opts = { fields };
  const parser = new Parser(opts);

  const csv = parser.parse(
    transactions.map((t) => ({
      title: t.title,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: new Date(t.date).toLocaleDateString(),
      note: t.note,
    }))
  );

  res.header('Content-Type', 'text/csv');
  res.attachment('transactions.csv');
  res.send(csv);
});

module.exports = {
  getTransactions,
  getSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  exportCSV,
};
