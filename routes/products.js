const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const ProductController = require('../controllers/product')
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        cb(null, false);
    }

};
const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5,
    }, fileFilter: fileFilter

});

var Product = require('../models/product');
var mongoose = require('mongoose');

router.get('/', ProductController.get_all_products)

router.post('/', upload.single('productImage'), auth, ProductController.create_product)

router.get('/:productId',ProductController.find_product);

router.patch('/:productId',auth, upload.single('productImage'), ProductController.update_product)

router.delete('/:productId', auth,ProductController.delete_product)

module.exports = router