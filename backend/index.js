const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');
connectDB();
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);


app.get("/", (req, res) => {
    res.send("Vendra Backend is working properly");
})

app.listen(port, () => {
    console.log(`Server is running on port no ${port}`);
})
