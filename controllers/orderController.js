const { 
    orders: Order, 
    orderItems: OrderItem, 
    products: Product, 
    carts: Cart, 
    cartItems: CartItem, 
    sequelize 
} = require('../models');

exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({
             where: { userId }, 
             include:  [{
        model: CartItem,
        include: [Product] 
         }], 
             transaction: t 
            });

        if (!cart || cart.CartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        let totalItem = 0;
        for (const item of cart.CartItems) {
               console.log(`Checking ${item.Product.name}: DB Stock is ${item.Product.stock}, Requested is ${item.quantity}`);
            if (Number(item.Product.stock) < Number(item.quantity)) {
                throw new Error(`Product ${item.Product.name} is out of stock`);
            }
            totalItem += item.Product.price * item.quantity;
        }

        const order = await Order.create({
             userId,
             totalItem,
             shippingAddress: req.body.shippingAddress,
             paymentMethod: req.body.paymentMethod,
                status: 'pending'
            }, { transaction: t });

  for (const item of cart.CartItems) {
          
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: item.Product.price 
            }, { transaction: t });

            await Product.decrement('stock', {
                by: item.quantity,
                where: { id: item.productId },
                transaction: t
            });
        }

        await CartItem.destroy({ 
            where: { cartId: cart.id }, 
            transaction: t 
        });

        await t.commit();

        res.status(201).json({
             success: true, message: "Order created successfully", 
             data: order 
            });

    } catch (error) {
        await t.rollback();
                console.error("ORDER ERROR:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Checkout failed", 
            error: error.message 
        });
    }   
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{ 
                model: OrderItem, 
                include: [Product] 
            }],
            order: [['createdAt', 'DESC']] // Newest orders first
        });
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};