const mongoose = require('mongoose');
const Schema   = mongoose.Schema ;

const department_schema = new Schema({
    name    :   {type  :  String , required: true,unique:true}, 
    faculty_id : {type : Schema.Types.ObjectId , ref: 'faculty',required:true},
    hod       : {type  :  Number , required: true,ref:'staff_member'},
    courses :  [{type : Schema.Types.ObjectId , ref: 'course'}],
});



module.exports = mongoose.model('department' , department_schema);