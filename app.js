const express = require("express");
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders')
const userRouter = require('./routes/user')

mongoose.connect('mongodb://root:'+process.env.MONGO_PW+'@cluster0-shard-00-00-bnajz.mongodb.net:27017,cluster0-shard-00-01-bnajz.mongodb.net:27017,cluster0-shard-00-02-bnajz.mongodb.net:27017/shop?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
//mongoose.connect('mongodb://localhost:27017/shopping');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin , X-Requiested-With,Accept, Authorization'
    );
    if (req.method === 'OPTION') {
        res.header('Access-Control-Allow-Method', 'PATCH,PUT, POST,DELETE, ')
        return res.status(200).json({});

    }
    next();
})
app.use((req, res, next) => {
    const error = new Error('not Found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    }

    )
})
module.exports = app;
