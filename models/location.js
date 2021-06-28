const mongoose = require('mongoose');
const Schema   = mongoose.Schema ;

const location_schema = new Schema({
    name    : {type  :  String , required: true},
    capacity : {type :Number , required:true}, 
       
})



module.exports = mongoose.model('location' , location_schema);