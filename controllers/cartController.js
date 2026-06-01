const { carts: Cart, cartItems: CartItem, products: Product } = require('../models');

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; 

        let [cart] = await Cart.findOrCreate({ where: { userId } });

        let item = await CartItem.findOne({ 
            where: { cartId: cart.id, productId: productId } 
        });

        if (item) {
            item.quantity += parseInt(quantity);
            await item.save();
        } else {
            item = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity
            });
        }

        res.status(200).json({ success: true, message: "Added to cart", data: item });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: { userId: req.user.id },
            include: [{
                model: CartItem,
                include: [Product] 
            }]
        });

        if (!cart) return res.status(200).json({ data: [] });

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};