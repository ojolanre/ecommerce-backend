const db = require('../models');

const Product = db.products;
const Category = db.categories;

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
};


exports.getCategoryProducts = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, { include: Product });
       if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error fetching category products:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
};

exports.createCategory = async (req, res) => {
    let categoryData = req.body;
    try {
        const newCategory = await Category.create(categoryData);
        res.status(201).json({
            success: true,
            data: newCategory
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }
        await category.update(req.body);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }
                // CHECK: Does this category have any products?
        const productCount = await Product.count({ where: { categoryId } });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                error: `Cannot delete category. It contains ${productCount} products. Please move or delete them first.`
            });
        }
        await category.destroy();
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
};
