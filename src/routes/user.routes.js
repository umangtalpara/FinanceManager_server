const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

router.post('/admin/change-password', auth, userController.adminChangePassword);

module.exports = router;
