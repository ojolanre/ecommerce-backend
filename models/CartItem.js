module.exports = (sequelize, DataTypes) => {

    const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cart', 
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        } 
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'CartItems'
});

    return CartItem;
}