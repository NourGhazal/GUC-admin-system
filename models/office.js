const mongoose = require('mongoose');
const Schema   = mongoose.Schema ;

const office_schema = new Schema({
    name    : {type  :  String , required: true},
    capacity : {type :Number , required:true}, 
    staff_members :  [{type :Number , ref: 'staff_member'}],   
})



module.exports = mongoose.model('office' , office_schema);