const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const auth = require('../middleware/auth');

router.post('/', auth, transactionController.createTransaction);
router.get('/', auth, transactionController.getTransactions);
router.put('/:id', auth, transactionController.updateTransaction);
router.put('/:id/settle', auth, transactionController.settleTransaction);
router.delete('/:id', auth, transactionController.deleteTransaction);

module.exports = router;
