const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middleware/auth');

router.get('/pnl/:projectId', auth, reportController.getProjectPnL);
router.get('/stats', auth, reportController.getOrgStats);

module.exports = router;
