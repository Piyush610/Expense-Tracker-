const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  exportCSV,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All transaction routes are protected

router.get('/summary', getSummary);
router.get('/export', exportCSV);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
