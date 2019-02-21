var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema ({
    productId :{ type:Schema.Types.ObjectId, required:true, ref:'Product'},
    quantity:{ type:Number,required:true},
});
module.exports=mongoose.model('Order',schema);
