const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const auth = require('../middleware/auth');

router.post('/', auth, categoryController.createCategory);
router.get('/', auth, categoryController.getCategories);
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
