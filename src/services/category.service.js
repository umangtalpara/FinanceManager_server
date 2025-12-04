const Category = require('../models/Category');

exports.createCategory = async (categoryData) => {
    const category = new Category(categoryData);
    await category.save();
    return category;
};

exports.getCategories = async (orgId) => {
    return await Category.find({ orgId });
};

exports.deleteCategory = async (categoryId) => {
    await Category.findByIdAndDelete(categoryId);
    return { message: 'Category deleted' };
};
