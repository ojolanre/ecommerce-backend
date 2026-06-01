module.exports = (sequelize, DataTypes) => {

    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
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
        },
        priceAtPurchase: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName: 'OrderItems'
    });

    return OrderItem;
}