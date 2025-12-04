const approvalService = require('../services/approval.service');

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        const transaction = await approvalService.updateStatus(id, status, userId);
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Transaction not found') {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === 'Not authorized to approve/settle') {
            return res.status(403).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};
