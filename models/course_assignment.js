const mongoose = require('mongoose');
const Schema   = mongoose.Schema ;

const course_assignment_schema = new Schema({
    course    : {type  :  Schema.Types.ObjectId , ref: 'course',required:true},
    department_id : {type : Schema.Types.ObjectId , ref: 'department',required:true}, 
    instructor:{type : Number , ref: 'staff_member',required:true}
})



module.exports = mongoose.model('course_assignments' , course_assignment_schema);