const db = require('../models');

const Product = db.products;
const Category = db.categories;

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ 
                include: [{
                model: Category,
                required: false 
            }] 
        });

        const role = req.user?.role || 'guest'; 
        if (role === 'admin') {
            return res.status(200).json({
                success: true,
                message: "Admin Product List",
                role: 'admin',
                user: req.user,
                data: products
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Customer Shop View",
                role: 'customer',
                user: req.user || null,
                data: products
            });
        }

            return res.status(200).json({
            success: true,
            message: "Product List",
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal Server Error',
            details: error.message 
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { include: Category });
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
};

exports.addProduct = async (req, res) => {
    let productData = req.body;
    try {
        const newProduct = await Product.create(productData);
        res.status(201).json({
            success: true,
            data: newProduct
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        await product.update(req.body);
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        await product.destroy();
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
};
