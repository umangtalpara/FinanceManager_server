const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approval.controller');
const auth = require('../middleware/auth');

router.put('/:id/status', auth, approvalController.updateStatus);

module.exports = router;
