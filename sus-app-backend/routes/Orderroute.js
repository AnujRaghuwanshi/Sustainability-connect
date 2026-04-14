// routes/Orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');


// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name price' // you can expand fields
      });

    res.status(200).json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch all orders', error });
  }
});



router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name' // Specify the fields you want to return
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

module.exports = router;