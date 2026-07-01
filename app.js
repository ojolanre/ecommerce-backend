const express = require("express");
const productRoutes = require('./routes/productRoute');
require('dotenv').config();
const app = express();
const categoryRoutes = require('./routes/categoryRoute');
const authRoutes = require('./routes/authRoute');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoute');

const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(express.static('public'))
app.use("/", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});