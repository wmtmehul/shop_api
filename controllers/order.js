var Order = require('../models/order');
var Product = require('../models/product');
const mongoose = require("mongoose");
const auth = require('../middleware/auth');

exports.order_get_all=(req, res, next) => {
    Order.find().populate("productId").then(docs => {
        res.status(200).json({
            count: docs.length,
            data: docs.map(doc => {
                return {
                    "_id": doc._id,
                    "product": doc.productId,
                    "quantity": doc.quantity
                }
            })
        })
    }).catch(err => {
        res.status(500).json({ massage: err })
    })
}
exports.create_order=(req, res, next) => {
    Product.findById(req.body.productId)    
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                productId: req.body.productId,
                quantity: req.body.quantity,
            })
            order.save().then(result => {
                  res.status(201).json({
                    message: "Order Created",
                    orderCreated: order,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + order.productId
                    }
                })
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });

        })
}
exports.find_order=(req, res, next) => {
    Order.findById(req.params.orderId).populate("productId")
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json({
                data: {
                    "_id": order._id,
                    "productId": order.productId,
                    "quantity": order.quantity,
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_order=(req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then(result => {
            if (result.deletedCount > 0) {

                res.status(200).json({
                    message: "Order deleted",

                })
            }
            else
                res.status(404).json({ message: 'No Order Found!' })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}