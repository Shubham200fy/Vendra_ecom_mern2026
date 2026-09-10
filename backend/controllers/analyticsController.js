const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user'});
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)
        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue
        })
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats', err: err.message });
    }
}

module.exports = { getAdminStats }