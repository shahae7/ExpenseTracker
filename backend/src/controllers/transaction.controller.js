const TransactionService = require('../services/transaction.service');

exports.addTransaction = async (req, res) => {
    try {
        const transaction = await TransactionService.addTransaction(req.user.id, req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const success = await TransactionService.updateTransaction(req.params.id, req.user.id, req.body);
        if (!success) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.uploadCsv = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let transactions = [];
        const mimeType = req.file.mimetype;

        if (mimeType === 'text/csv' || mimeType === 'application/vnd.ms-excel') {
            transactions = await TransactionService.processCsv(req.user.id, req.file.path);
        } else if (mimeType.startsWith('image/')) {
            transactions = await TransactionService.processImage(req.user.id, req.file.path);
        } else {
            return res.status(400).json({ error: 'Invalid file type. Only CSV or Images allowed.' });
        }

        res.json({ message: 'File processed successfully', count: transactions.length, transactions });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { date, month, year } = req.query;
        // Placeholder for fetch logic (will add to service later if complex)
        const TransactionModel = require('../models/transaction.model');
        const transactions = await TransactionModel.findByUserId(req.user.id, { date, month, year });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const TransactionModel = require('../models/transaction.model');
        const success = await TransactionModel.delete(req.params.id, req.user.id);
        if (!success) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
