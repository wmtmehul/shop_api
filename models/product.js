var mongoose = require('mongoose');
var schema = mongoose.Schema;

var schema = new mongoose.Schema ({
    productImage :{type:String, required:true},
    title:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number,required:true},
    
});

module.exports=mongoose.model('Product',schema);

 