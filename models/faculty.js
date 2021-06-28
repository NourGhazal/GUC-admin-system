const mongoose = require('mongoose');
const Schema   = mongoose.Schema ;

const faculty_schema = new Schema({
    name    : {type  :  String , required: true,unique:true}, 
    departments :  [{type : Schema.Types.ObjectId , ref: 'course'}],
})



module.exports = mongoose.model('faculty' , faculty_schema);