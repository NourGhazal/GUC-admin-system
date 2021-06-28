const mongoose = require('mongoose');
const Schema   = mongoose.Schema ;

const course_schema = new Schema({
    name    : {type  :  String , required: true},
    department_id : {type : Schema.Types.ObjectId , ref: 'department',required:true}, 
    coordinator: {type :Number , ref: 'staff_member'},
    slots : [{type : Schema.Types.ObjectId,ref:'slot' }],
    required_slots :{type:Number,required:true}
    
})



module.exports = mongoose.model('course' , course_schema);