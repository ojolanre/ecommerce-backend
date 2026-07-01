const { Sequelize, DataTypes } = require('sequelize');
const CONFIG = require('../config/db');

const sequelize = new Sequelize(
    CONFIG.DB_NAME, 
    CONFIG.DB_USER, 
    CONFIG.DB_PASSWORD, 
{
  host: CONFIG.DB_HOST,
  port: CONFIG.DB_PORT ,
  dialect: CONFIG.DB_DIALECT,
          dialectOptions: {
            ssl: {
                rejectUnauthorized: false // Required for Aiven/Render connections
            }
        },
        logging: false
});


  sequelize.authenticate()
  .then(() => {
  console.log('Connection has been established successfully.');
  })
  .catch((error) => {
  console.error('Unable to connect to the database:', error);
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Add models or tables here
db.products = require('./Product')(sequelize, DataTypes);
db.users = require('./User')(sequelize, DataTypes);
db.carts = require('./Cart')(sequelize, DataTypes);
db.cartItems = require('./CartItem')(sequelize, DataTypes);
db.categories = require('./Category')(sequelize, DataTypes);
db.orders = require('./Order')(sequelize, DataTypes);
db.orderItems = require('./OrderItem')(sequelize, DataTypes);

db.users.hasOne(db.carts, { foreignKey: 'userId' });
db.carts.belongsTo(db.users, { foreignKey: 'userId' });

db.users.hasMany(db.orders, { foreignKey: 'userId' });
db.orders.belongsTo(db.users, { foreignKey: 'userId' });

db.carts.hasMany(db.cartItems, { foreignKey: 'cartId' });
db.cartItems.belongsTo(db.carts, { foreignKey: 'cartId' });

db.products.hasMany(db.cartItems, { foreignKey: 'productId' });
db.cartItems.belongsTo(db.products, { foreignKey: 'productId' });

db.categories.hasMany(db.products, { foreignKey: 'categoryId' });
db.products.belongsTo(db.categories, { foreignKey: 'categoryId' });

db.orders.hasMany(db.orderItems, { foreignKey: 'orderId' });
db.orderItems.belongsTo(db.orders, { foreignKey: 'orderId' });

db.products.hasMany(db.orderItems, { foreignKey: 'productId' });
db.orderItems.belongsTo(db.products, { foreignKey: 'productId' });



db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Tables sync successfully.');
    }).catch((error) => {
        console.log(error)
    });


module.exports = db;