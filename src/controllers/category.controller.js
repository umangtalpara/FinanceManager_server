const categoryService = require('../services/category.service');

exports.createCategory = async (req, res) => {
    try {
        const { name, type, orgId } = req.body;
        const category = await categoryService.createCategory({ name, type, orgId });
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getCategories = async (req, res) => {
    try {
        const { orgId } = req.query;
        const categories = await categoryService.getCategories(orgId);
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
