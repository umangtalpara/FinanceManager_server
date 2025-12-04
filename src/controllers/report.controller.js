const reportService = require('../services/report.service');

exports.getProjectPnL = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await reportService.getProjectPnL(projectId);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getOrgStats = async (req, res) => {
    try {
        const { orgId } = req.query;
        if (!orgId) return res.status(400).json({ message: 'Org ID required' });

        const result = await reportService.getOrgStats(orgId);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
