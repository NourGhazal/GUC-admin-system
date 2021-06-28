const mongoose = require('mongoose');
const staff_member = require('./staff_member');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    type : {type:String},
    theRequstingAcademicMemberID : {type : Number,ref:'staff_member'},
    theAcademicMemberReplacementID : {type: Number,ref:'staff_member'},
    desiredSlot : [{type: Schema.Types.ObjectId, ref: 'slot'}], //required logic
  //  desiredSlot : [{type:Object}], //required logic
    course_id : {type:Schema.Types.ObjectId,ref:'course'},
    // course_id : {type:Object},
    targetedDay : {type:Date}, //day of absence
    submittedDay : {type:Date , required : true}, //request date
    desiredDayOff : {type: String }, //required logic
    // Boss : {type : Schema.Types.ObjectId , ref: 'staff_member'},
    Boss : {type : Number,ref:"staff_member"},
    reason : {type: String}, //required logic
    status :{type: String , required :true , default:"pending"},
    comment : {type: String}
})

// const request1 = {
//     type : "replacment" ,
//     theRequstingAcademicMemberID: "123",
//     theAcademicMemberReplacementID : "456",
//     targetedDay : "25/12/2020",
//     submittedDay : "20/12/2020",
//     autoHOD_CO : "999",
//     status : "pendeing"
// }

// const request2 = {
//     type : "sick" ,
//     theRequstingAcademicMemberID: "123",
//     targetedDay : "25/12/2020",
//     submittedDay : "29/12/2020",
//     autoHOD_CO : "999",
//     status : "pendeing"
// }




module.exports = mongoose.model('request', requestSchema);