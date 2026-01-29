const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Middleware is applied in server.js, but we can also import it here if we want granular control.
// For now, it's applied globally to /api/transactions in server.js


router.post('/', transactionController.addTransaction);
router.put('/:id', transactionController.updateTransaction);
router.post('/upload', upload.single('file'), transactionController.uploadCsv);
router.get('/', transactionController.getTransactions);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
