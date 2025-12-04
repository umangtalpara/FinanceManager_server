const transactionService = require('../services/transaction.service');

exports.createTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transaction = await transactionService.createTransaction(req.body, userId);
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Project not found') {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === 'Not a member of this organization') {
            return res.status(403).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { projectId } = req.query;
        if (!projectId) return res.status(400).json({ message: 'Project ID required' });

        const transactions = await transactionService.getTransactions(projectId);
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transaction = await transactionService.updateTransaction(req.params.id, req.body, userId);
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Transaction not found') return res.status(404).json({ message: err.message });
        if (err.message === 'Not authorized to update this transaction') return res.status(403).json({ message: err.message });
        res.status(500).send('Server error');
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await transactionService.deleteTransaction(req.params.id, userId);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Transaction not found') return res.status(404).json({ message: err.message });
        if (err.message === 'Not authorized to delete this transaction') return res.status(403).json({ message: err.message });
        res.status(500).send('Server error');
    }
};

exports.settleTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transaction = await transactionService.settleTransaction(req.params.id, userId);
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Only Admins can settle transactions') return res.status(403).json({ message: err.message });
        res.status(500).send('Server error');
    }
};
