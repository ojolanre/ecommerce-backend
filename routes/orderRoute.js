const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

router.post('/checkout', authenticateToken, orderController.createOrder);

module.exports = router;