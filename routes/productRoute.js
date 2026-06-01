const express = require('express');
const productController = require('../controllers/productController');
const productRouter = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');

productRouter.get('/', (req, res) => {
    res.json({ message: "Welcome to the ecommerce API Homepage!" });
});

productRouter.post('/products', authenticateToken, isAdmin, productController.addProduct);
productRouter.get('/products', productController.getProducts);
productRouter.get('/products/:id', productController.getProductById);
productRouter.put('/products/:id', authenticateToken, isAdmin, productController.updateProduct);
productRouter.delete('/products/:id', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = productRouter;