const mongoose = require('mongoose');
const Schema   = mongoose.Schema ;
autoIncrement = require('mongoose-auto-increment');
const URL = "mongodb+srv://MohamedAlekhsasy:Alekhsasy@milestones.9o0rb.mongodb.net/M1?retryWrites=true&w=majority";
const connectionParams = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true };
const connection = mongoose.createConnection(URL,connectionParams);
autoIncrement.initialize(connection);
const staff_member_schema = new Schema({
    name          : {type  :  String , required: true},
    email         : {type  :  String , required: true,unique:true},
    password      : {type  :  String , required: true , default: "123456"},
   // _id           : {type  :  String , required: true , unique : true},
    day_off       : {type  :  String },
    salary        : {type  :  Number , required: true},
    role          : {type  :  String , required: true},
    dirty_bit     : {type  :  Number , default : 1},
    requests      : [{type : Schema.Types.ObjectId , ref: 'request'}],
    leave_dates   : [{type : Date}],
    //3askora
    gender : {type : String},
    sentRequests      : [{type : Schema.Types.ObjectId , ref: 'request'}],
    receivedRequests      : [{type : Schema.Types.ObjectId , ref: 'request'}],
    schedule : [{type :Schema.Types.ObjectId , ref: 'schedule'}],
    notifications : [{type : String}],
    departement_id:{type:Schema.Types.ObjectId,ref:"departement"},
    course_id:[{type:Schema.Types.ObjectId,ref:'course'}],
    log           : [{type : Object }],
    office        : {type : Schema.Types.ObjectId , ref: 'office' ,required:true},
    personal_info : {type : Object }
})

staff_member_schema.plugin(autoIncrement.plugin, {
    model: 'staff_member',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('staff_member' , staff_member_schema);