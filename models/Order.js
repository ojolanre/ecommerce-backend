module.exports = (sequelize, DataTypes) => {

    const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', 
            key: 'id'
        }
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'Orders'
});

    return Order;
}