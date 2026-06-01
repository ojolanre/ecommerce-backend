
module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // 10 digits total, 2 after decimal
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
        categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Every product must have a category
        references: {
            model: 'Categories', // Name of the table in MySQL
            key: 'id'
        }
    }
}, {
      tableName: 'Products',
});

    return Product;
}