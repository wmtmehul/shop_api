const express = require('express');
var Order = require('../models/order');
var OrderController = require('../controllers/order');

const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, OrderController.order_get_all);

router.post('/', auth, OrderController.create_order)

router.get("/:orderId", auth, OrderController.find_order);

router.delete("/:orderId", auth, OrderController.delete_order);

module.exports = router