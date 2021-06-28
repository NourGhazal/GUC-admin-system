const mongoose = require('mongoose');
const Schema   = mongoose.Schema ;

const slot_schema = new Schema({
    time : {type :Date,required:true}, 
    location :  {type : Schema.Types.ObjectId , ref: 'location',required:true},
    instructor:{type : Number , ref: 'staff_member',required:true},
    course_id:{type:Schema.Types.ObjectId,required:true}
     
})



module.exports = mongoose.model('slot' , slot_schema);