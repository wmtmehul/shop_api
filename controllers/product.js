const mongoose = require("mongoose");

var Product = require('../models/product');

exports.get_all_products = (req, res, next) => {
    Product.find().then(docs => {
        res.status(200).json({
            count: docs.length,
            data: docs.map(doc => {
                return {
                    _id: doc._id,
                    productImage: doc.productImage,
                    title: doc.title,
                    description: doc.description,
                    price: doc.price,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        })
    }).catch(err => {
        res.status(404).json({ message: 'cant find products' })
    })
}
exports.create_product = (req, res, next) => {
    console.log(req.file);
    var product = new Product({
        productImage: req.file.path,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: " Product Added Sucessfully",
            product: {
                "productImage": result.productImage,
                "title": result.title,
                "description": result.description,
                "price": result.price,
                "_id": result._id,

            }
        })
    }).catch(err => {
        res.status(400).json({ error: err })
    });



}
exports.find_product = (req, res, next) => {

    Product.findById(req.params.productId)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    data: {
                        _id: doc._id,
                        productImage: doc.productImage,
                        title: doc.title,
                        description: doc.description,
                        price: doc.price,
                    }
                });
            } else
                res.status(404).json({ Error: 'No entry Found' });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })

}
exports.update_product = (req, res, next) => {

    const id = req.params.productId
    console.log(id);
    Product.findByIdAndUpdate({ '_id': id }, {
        $set: {
            productImage: req.file.productImage,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
        }
    }).then(result => {
        res.status(200).json({
            message: 'Product Updated Successfully',
            result: result
        })
    }).catch(err => {
        res.status(500).json({ Error: err })
    })
}
exports.delete_product = (req, res, next) => {
    const id = req.params.productId

    Product.deleteOne({ '_id': id }).then(result => {
        if (result.deletedCount > 0) {

            res.status(200).json({
                message: 'Product Deleted'

            })
        }
        else {
            res.status(404).json({ message: 'No Product Found!' })
        }
    }).catch(err => {
        res.status(500).json({ Error: err })
    })

}
