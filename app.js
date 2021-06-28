const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const moment = require("moment");
const app = express();
const port = process.env.PORT || 1000;
const URL = "mongodb+srv://MohamedAlekhsasy:Alekhsasy@milestones.9o0rb.mongodb.net/M1?retryWrites=true&w=majority";
const connectionParams = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true };
let today = new Date();
let dirtyBit = 1 ;
const minutes = 10080 ;
var cors = require('cors');
//const staff_member     = require("../models/staff_member");
const securitKey ="crugy2tau1c";// Math.random().toString(36).substring(7);
let ac = 444;
let hr = 10;
// Use JSON Format and body-parser !! 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const path = require('path');
// Server static assets if Production
if(process.env.NODE_ENV === 'production')
{
    // set static folder 
    app.use(express.static('client/build'))

    app.get("*" ,(req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
    
}

//Connecting DataBase !!
mongoose.connect(URL, connectionParams).then(() => {
    console.log("Connected DB");
    absent();
}).catch(() => {
    console.log("DB failed");
});

//new staff_member()
// Use JSON Format and body-parser !! 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// =====================================================================================================================
// =====================================================================================================================

// Retriving Models
const staff_member = require('./models/staff_member');
const course = require("./models/course");
const faculty = require("./models/faculty");
const department = require("./models/department");
const office = require("./models/office");
const course_assignment = require("./models/course_assignment");
const { replacementReqMEMValidation, replacementReqHODValidation, slotLinkingReqValidation, changeDayOffReqValidation, leaveReqValidation } = require("./validation/acdMemValidation");
const Request = require("./models/request");
const slot = require("./models/slot");
const Schedule = require("./models/Schedule");
const location = require("./models/location");

const { json } = require("express");
// =====================================================================================================================
// =====================================================================================================================





//Midlewares :: >>>
const isLogged = (req, res, next) => {
    // const authHeader = req.headers['authorization'];

    // const token =authHeader && authHeader.split(" ")[1];


    //console.log("Reached");
    console.log(req.headers);
    console.log(req.headers.authorization); 

    if (!(req.headers.authorization)) {
        if(!req.header.token)
        {
        return res.status(401).json({msg:"please log in first"});}
        else{
        next();
    }
    return
    }
    console.log("Succes");
    try { 
        req.header.token=req.headers.authorization;
        next();
    } catch (err) {
        res.status(400).send("Expired Session \n please go to login page !!")
    }
}



//Functions
const handel_request = async (id,body)=>{

    let my_request =  await Request.findOne({_id:id});
    if(my_request.type==="replacement"){
        let staff1 = staff_member.findOne({_id:my_request.theRequstingAcademicMemberID},{schedule:1,_id:0});
        let staff2 = staff_member.findOne({_id:my_request.theAcademicMemberReplacementID},{schedule:1,_id:0});
        staff_member.updateOne({_id:my_request.theRequstingAcademicMemberID},{staff2}).then(async()=>{
            await staff_member.updateOne({_id:my_request.theAcademicMemberReplacementID},{staff1});
        }).catch((err)=>{
            console.log(err);
        });
        return;
    }
    if(my_request.type==="slot linking"){
       
        await slot.updateOne({_id:my_request.desiredSlot},{instructor:my_request.theRequstingAcademicMemberID});
       let my_join =  await staff_member.aggregate({
            $lookup:{
              from: Schedule,
              localField: schedule,
              foreignField: _id,
              as: slots
            }
        });
     let new_slot = my_join.slots[0].slot.push();
     await Schedule.updateOne({_id:my_join.schedule},{slot:new_slot});
     return
    }
    if(my_request.type==="change day off"){
       staff_member.updateOne({_id:my_request.theRequstingAcademicMemberID},{day_off:my_request.desiredDayOff}).then((succ)=>{
            return succ;
        }).catch((err)=>{
            return err;
        });
    }
    if(my_request.type==="accidental"||my_request.type==="sick"||my_request.type==="maternity"||my_request.type==="compensation"){
            let my_leaves = await staff_member.findOne({_id:my_request.theRequstingAcademicMemberID},{_id:0,leave_dates})
            let leaves = my_leaves.leave_dates?my_leaves.leave_dates.push(my_request.targetedDay):[my_request.targetedDay];
           await staff_member.updateOne({_id:my_request.theRequstingAcademicMemberID},{leaves});
           return;
    }
    
};

const notify_staff = async(logged_user)=>{
    try {
        const acdMemID = logged_user.id;
        const Allrequests = (await staff_member.findOne({ _id: acdMemID })).sentRequests; //when we create staffMem should have schedule property chnge to findById
        let result = [];
        for (let index = 0; index < Allrequests.length; index++) {
            const requestID = Allrequests[index];
            const currentReq = await Request.findOne({ _id: requestID, status: { $ne: "pending" } });
            if (currentReq != null) {
                const status = currentReq.status;
                const notification = `your request ${requestID} has been ${status}`
                result.push(notification);
            }
        }

        await staff_member.updateOne(
            { _id: acdMemID }, { $set: { notifications: result } }
        )


        return res.json(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const absent = async()=>{
  
if(today.getHours() > 19 && today.getHours() < 23 )
{
   
    if( dirtyBit === 1)
    {
       
    let array ; 
    await staff_member.find((err , arrayFound) => {
        if(err) return console.log(err);
        array = arrayFound ;
    })
    array = array.filter((one) =>{
      
        return((( one.log[one.log.length -1] !== "start"  ) || one.log[one.log.length -1].signin.getDay() !== today.getDay() ||   (one.log[one.log.length -1].absent && one.log[one.log.length -1].absent !== today.getDay()))  && ( today.getDay() !== 5 && today.getDay() !== one.day_off)) ;
    }) 
    array.forEach((one) =>{  
        let log  = one.log;
        log.push({absent : today});
        staff_member.findByIdAndUpdate({_id : one._id} , {log : log} , (err , updated)=>{
            if(err) return console.log(err);
            console.log(updated);
        } )
    })
    dirtyBit = 0 ;
    }
    
}
else dirty_bit = 1 ;

}

const viewAttendance = async(id , res)=>{
    await staff_member.findById({_id : id} , (err,found)=>{
        if(err) return res.json(err);
        res.json(found.log);
    })
}
const viewMonthAttendance = async(id , month ,res)=>{
    let array ; 
    await staff_member.findById({_id : id} , (err,found)=>{
        if(err) return res.json(err);
        array = found.log ;
    })
    //console.log(array + "Arr");
    array = array.filter((one)=>{
        
        return(one !== "start" && ((one.signin && one.signin.getMonth() === Number(month)) ||  (one.signout && one.signout.getMonth() === Number(month))))
    })
    res.json(array);
}

const viewMissingDays = async(id , res) => {
    let array ;
    await staff_member.findById({_id : id} , (err,found)=>{
        if(err) return res.json(err);
        array = found.log ; 
    })
    try {
        array = array.filter((one) =>{
            return(one.absent);
        })
        res.json(array);
    } catch(err){ res.json(err)}
    
}
const viewMissingHours = async(id , res) => {
    let array ;
    let hoursPlusMinutes = 0;
    let leaves ;
    await staff_member.findById({_id : id} , (err,found)=>{
        if(err) return res.json(err);
        array = found.log ;
        leaves = found.leave_dates ; 
    })
    try {
        array.forEach((one)=>{
            
            if(one.absent)
            {
                let filteredLeave = leaves.filter((leave)=>
                {
                    return(one.absent.getDay() ===  leave.getDay() && one.absent.getMonth() === leave.getMonth()) ;
                })
                if(filteredLeave)
                {
                    hoursPlusMinutes += 8*60 + 24 ;
                }
            }
            else if(one !== "start" && one.signin && one.signout)
            {
        
                hoursPlusMinutes += (one.signout.getHours() * 60 + one.signout.getMinutes()) - (one.signin.getHours() * 60 + one.signin.getMinutes())  ;
            }
        })
        if(hoursPlusMinutes - minutes <= 0 ) res.json("Your missing is : " + (-(hoursPlusMinutes - minutes)) + " Minutes");
        else res.json("Your extra is : " +(hoursPlusMinutes - minutes)  + " Minutes");
    } catch(err){ res.json(err)}
    
}



// =====================================================================================================================
// =====================================================================================================================

// Routes
// app.get("/" ,async (req,res)=>{
//     let { name, email, salary, office_id, role } = req.body;
//         const salt = await bcrypt.genSalt();
//         const hashpassword = await bcrypt.hash("123456", salt);

      
        
       

//     try{
//         const s1 = new staff_member({
//             name  : "Mohamed",
//             email : "alekhsasy@gmail.com",
//         office:"5fde954b77bbfe40e0409bfe",
//             salary : 2000,
//             role : "HR",
//             password: hashpassword,
//         })
//         await s1.save();
//         res.send("member Saved");
//     }catch(err){
//         res.send(err);
//     }

// })

// =====================================================================================================================
// =====================================================================================================================

// staff_member Functionalities
app.post('/logout',isLogged,(req,res)=>{
    req.header.token=null;
    res.json({msg:"logged out succefully"})
});
app.post('/location',  (req,res)=>{
    try{
    console.log(req);
    let name = req.body.name;
    let capacity = req.body.capacity;
    let newlocation = new location({
        name:name,
        capacity:capacity
    });
    newlocation.save().then((resp)=>{
        res.json({msg:"DONE"}
    )}).catch((err)=>{
        res.json(err)
    }); }
    catch(error){
        res.json({error,msg:"err"});
    }
});
app.post('/slot',  (req,res)=>{
    try{
    let location = req.body.location;
    let instructor = req.body.instructor;
    let course_id = req.body.course_id;
    let time = Date.now();
    let newslot = new slot({
        location:location,
        instructor:instructor,
        course_id:course_id,
        time:time,
    });
    newslot.save().then((resp)=>{
        res.json({msg:"DONE",resp});
    }).catch((err)=>{
        res.json(err);
    }); }
    catch(error){
        res.json({error,msg:"err"});
    }
});
app.post('/schedule',  (req,res)=>{
    try{
    let slot = req.body.slot;
   
    let time = Date.now();
    let newschedule = new Schedule({
        slot:slot,
        day:time,
    });
    newschedule.save().then((resp)=>{
        res.json({msg:"DONE",resp})
    }).catch((err)=>{
        json(err);
    }); 
}
    catch(error){
        res.json({error,msg:"err"});
    }
});

app.get("/viewprofile", isLogged, async (req, res) => {
    try {
        const decoded = jwt.verify(req.header.token,securitKey);
        staff_member.findById(decoded.id, (err, found) => {
            if (err) return res.json(err);
            res.json(found);
        });
    } catch (err) {
        res.json(err);
    }
});
app.put("/updateprofile", isLogged, async (req, res) => {
    const decoded = jwt.verify(req.header.token,securitKey);
    console.log(1);
    try {
        console.log(2);
        if (req.body.id || req.body.name) return res.json("Sorry you can't update ID or Name !!");
        console.log(3);
        let profileOwner;
        await staff_member.findById({_id : decoded.id}, (err, found) => {
            if (err) return res.json(err);
            profileOwner = found;
            console.log(4);
        });
        setTimeout(function(){}, 500);
        console.log(5);
        const profileSchema = Joi.object({
            email: Joi.string().email().required(),
            day_off: Joi.string(),
            salary: Joi.number().min(1),
            personal_info : Joi.string()
        })
        console.log(6);
        const { error } = profileSchema.validate(req.body);
        console.log(7);
        if (error) {
            console.log(8);
            const msg = error.details.map(el => el.message).join(",");
            console.log(msg)
            res.json(msg);
        } else {
            console.log(9);
            if (decoded.role !== "HR") {
                if (req.body.salary /*&&req.body.faculty &&req.body.faculty*/ || req.body.role) {
                    return res.json("You can't update your salary, role, faculty or department !!");
                }

                if (decoded.role === "HOD" || decoded.role === "CI" || decoded.role === "AM"||decoded.role==="CO") {

                    await staff_member.findByIdAndUpdate(decoded.id, req.body, (err, updated) => {
                        if (err) return res.json(err);
                        res.json(updated);
                        console.log(10);
                    })
                }
            } else {
                console.log(11);
                if (req.body.role) return res.json("You can't change your role !!");
                console.log(12);
                await staff_member.findOneAndUpdate({_id : decoded.id},req.body, {new : true},(err, updated) => {
                    console.log(13)
                    if (err) return res.json(err);
                    console.log(15)
                    console.log(updated)
                    res.json(updated);
                   
                })
                setTimeout(function(){}, 500);
                console.log(14)
            }
        }

    } catch (err) {
        console.log("Error");
        console.log(err);
    }
})
// ***************************************************************************
app.get("/resetPassword", isLogged, async (req, res) => {
    console.log(req.header.token)
    res.json({ msg: "gfhhj" });
    // isLogged then render the form to reset password 

})
app.post("/resetPassword", isLogged,async (req, res) => {
    console.log("reach")
    const decoded = jwt.verify(req.header.token,securitKey);
    if (req.body.password !== req.body.confirm) return res.json("Password must match Confirm Password");
    const salt = await bcrypt.genSalt();
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    let profileOwner;
    await staff_member.findByIdAndUpdate(decoded.id, { password: hashpassword, dirty_bit: 0 }, (err, updated) => {
        if (err) return res.json(err);
        res.json("Passwor Successfully Updated !!");
    });
})

app.post("/signin", isLogged,async(req,res) =>{
    console.log("Start");
    let log ;
    let person ;
    console.log("here1");
    const decoded = jwt.verify(req.header.token,securitKey);
    await staff_member.findById(decoded.id,(err,found)=>{
        if(err) return res.json(err);
        console.log(found.log);
        log = found.log ;
    })
    log.push({signin: new Date()});
    console.log(log);
    staff_member.update({_id : decoded.id},{$set:{log :log}},(err,updated)=>{
        if(err) return res.json(err);
        res.json(updated);
    })
})

app.post("/signout", isLogged,async(req,res) =>{
    console.log("Start");
    let log ;
    let person ;
    console.log("here1");
    const decoded = jwt.verify(req.header.token,securitKey);
    await staff_member.findById(decoded.id,(err,found)=>{
        if(err) return res.json(err);
        console.log(found.log);
        log = found.log ;
    })
    let last  =log[log.length - 1];
    if(last.signin.getDay() !== (new Date()).getDay()) log.push({signout: new Date()});
    else{
    last.signout = new Date();
    log[log.length -1] = last ; 
    }
       
    console.log(log);
    staff_member.update({_id : decoded.id},{$set:{log :log}},(err,updated)=>{
        if(err) return res.json(err);
        res.json(updated);
    })
})

app.get("/viewAttendance" , isLogged , (req,res)=>{
    const decoded = jwt.verify(req.header.token , securitKey);
    viewAttendance(decoded.id , res);
})
app.get("/viewMonthAttendance" , isLogged , (req,res)=>{
    const decoded = jwt.verify(req.header.token , securitKey);
    viewMonthAttendance(decoded.id , req.body.month, res); 
})
app.get("/viewMissingDays" , isLogged , (req,res)=>{
    const decoded = jwt.verify(req.header.token , securitKey);
    viewMissingDays(decoded.id , res);
})
app.get("/viewMissingHours" , isLogged , (req,res)=>{
    const decoded = jwt.verify(req.header.token , securitKey);
    console.log(1);
    viewMissingHours(decoded.id , res);
})
app.get("/viewActualSalary" , isLogged , async(req,res)=>{
    if(today.getDate() === 1)
    {
        const decoded = jwt.verify(req.header.token,securitKey);
    let array ;
    let leaves ; 
    let hoursPlusMinutes = 0;
    let actualSalary ;
    let permanentSalary;
    await staff_member.findById({_id : decoded.id} , (err,found)=>{
        if(err) return res.json(err);
        array = found.log ;
        leaves = found.leave_dates ;
        permanentSalary = found.salary ;
        actualSalary = permanentSalary ;
    })
    let days = array.filter((one) =>{
            
            if(one.absent)
            {
                let filteredLeave = leaves.filter((leave)=>
                {
                    return(one.absent.getDay() ===  leave.getDay() && one.absent.getMonth() === leave.getMonth()) ;
                })
                return(!filteredLeave) ;
            }
        })
     let missingDays = days.length ;
     array.forEach((one)=>{
            
        if(one.absent)
        {
            let filteredLeave = leaves.filter((leave)=>
            {
                return(one.absent.getDay() ===  leave.getDay() && one.absent.getMonth() === leave.getMonth()) ;
            })
            if(filteredLeave)
            {
                hoursPlusMinutes += 8*60 + 24 ;
            }
        }
        else if(one !== "start" && one.signin && one.signout)
        {
    
            hoursPlusMinutes += (one.signout.getHours() * 60 + one.signout.getMinutes()) - (one.signin.getHours() * 60 + one.signin.getMinutes())  ;
        }
    })
     actualSalary -= missingDays * (permanentSalary/60);
     if(minutes - hoursPlusMinutes > 179) actualSalary -= (minutes - hoursPlusMinutes) * (permanentSalary/4800) ; 
    }
})

// =====================================================================================================================
// =====================================================================================================================

//Auth
// app.post('/register', isLogged ,async (req,res)=>{
//     // /when using async await we have to use try catch as awiat only works when it succeds
//     try{

//         const registerSchema = Joi.object({
//             name : Joi.string().required(),
//             email : Joi.string().email().required(),
//             day_off : Joi.string(),
//             salary : Joi.number().required().min(1),
//             role : Joi.string().required(),
//             office: Joi.string().required()
//         })
//         const {error} = registerSchema.validate(req.body);
//         if(error)
//         {
//             const msg = error.details.map(el => el.message).join(",");
//             res.json(msg);
//         }else{
//             // ** handle condition of hr setter (Done)
//             const decoded = jwt.verify(req.header.token , securitKey);
//             if(decoded.role !== "HR") return res.json("You are not allowed to add new member");
//             const salt =await bcrypt.genSalt();
//             const hashpassword = await bcrypt.hash("123456",salt);
//             req.body.password = hashpassword;
//             if(req.body.role === "HR") req.body.id = "hr-"+hr;
//             else req.body.id = "ac-"+ac;
//             const member = new staff_member(req.body);
//             member.save();
//             res.json("Member Saved")
//         }


//         }catch(err){

//          res.json(err.details.message);
//         }
// });


app.post('/login', async (req, res) => {
    try {

        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
        const { error } = loginSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
           return res.status(400).json(msg);
        } else {
            // ** handle condition of hr setter

            const salt = await bcrypt.genSalt();
            // const hashpassword = await bcrypt.hash(req.body.password,salt);
            const existinguser = await staff_member.findOne({ email: req.body.email });
            if (!existinguser) return res.status(400).json({ msg: "Email not registered" });
            const isMatched = await bcrypt.compare(req.body.password, existinguser.password);
            if (!isMatched)
                return res.status(400).json({ msg: "Incorrect Password" });
            req.header.token = jwt.sign({ id: existinguser._id, role: existinguser.role }, securitKey);
            console.log(req.header.token);
            res.json({
               existinguser,
               token:req.header.token,
            })
            if (existinguser.dirty_bit === 1) {
             //   res.redirect("/resetPassword");
            }
            /* 
            const decoded = jwt.verify(token,securitKey)    
          res.json({
            decoded,
            token ,// equivilant to token:token if they have the same name
            user:{
                id :existinguser._id,
                email:existinguser.email,
            }
        })
            */
        }


    } catch (err) {

        res.json(err);
    }
});


// =====================================================================================================================
// =====================================================================================================================
//_________________HR_____________________________

app.get('/office',isLogged,(req,res)=>{
    try{
        const user = jwt.verify(req.header.token, securitKey);
       
            office.find().then((staff)=>{
                    res.json(staff);
            });
      
        }
        catch(error){
            res.status(400).json({msg:error.message});
        }
})
app.get('/faculties',isLogged,(req,res)=>{
    try{
    const user = jwt.verify(req.header.token, securitKey);
   
        faculty.find().then((staff)=>{
                res.json(staff);
        });
  
    }
    catch(error){
        res.status(400).json({msg:error.message});
    }
});
app.get('/department/:id',isLogged,(req,res)=>{
    department.findOne({_id:params.id}).then(res=>json(res)).catch(err=>(json(err)))
})
app.get('/staff/:id',isLogged,(req,res)=>{
    staff_member.findOne({_id:params.id}).then(res=>json(res)).catch(err=>(json(err)))
})
app.get('/departments',isLogged , (req,res)=>{
    try{
  
        department.find().then( (departments)=>{
            let deparr = []
            let bb ={};  
            departments.forEach(async entry => {
                 resp = await  staff_member.findOne({_id:entry.hod});
                deparr.push({_id:entry._id,faculty_id:entry.faculty_id,name:entry.name,hod:entry.hod,courses:entry.courses,user:resp});     
            });
           setTimeout(()=>{
            res.json(deparr);
           },1500)
           
            
                
        });
  
    }
    catch(error){
        res.status(400).json({msg:error.message});
    }
});
app.get('/courses',isLogged,(req,res)=>{
    try{
    const user = jwt.verify(req.header.token, securitKey);
    if(user.role==="HR"){
        course.find().then((staff)=>{

            let deparr = []
            let bb ={};  
            staff.forEach(async entry => {
                 resp = await  staff_member.findOne({_id:entry.coordinator});
                deparr.push({course:entry,user:resp});     
            });
           setTimeout(()=>{
            res.json(deparr);
           },1500)
                
        });
    }
   else{
    if(user.role==="HOD"){
        course.find({department_id:user.departement_id}).then((staff)=>{
                res.json(staff);
        });
    }
    else{
        if(user.role==="CI"){
           
        } 
        else{
            res.status(401).json("You are not allowed to view these courses");
        }
    }
   }
    }
    catch(error){
        res.status(400).json({msg:error.message});
    }
});
app.post('/faculty', isLogged, async (req, res) => {
    
    try{
        const faculty_schema = Joi.object({
            name: Joi.string().required(),
            departments: Joi.array().items(Joi.string())
        })
        const { error } = faculty_schema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
           return res.status(400).json(msg);
        }
    const staff_member = jwt.verify(req.header.token, securitKey);
    if (staff_member.role === "HR") {
       let name = req.body.name;
       let departments = (req.body.departments)?req.body.departments:[];
        const new_faculty = new faculty({
            name: name,
            departments: departments
        });
        const saved_faculty = await new_faculty.save();
        res.json(saved_faculty);
    }
    else {
        res.status(400).json({ mag: "You are not allowed to add faculties" })
    } 
}
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.delete('/faculty/:id', isLogged, async (req, res) => {
    try{    
    
    const staff_member = jwt.verify(req.header.token, securitKey);
    if (staff_member.role === "HR") {
        const deleted = await faculty.deleteOne({ _id: req.params.id });
        if (deleted.deletedCount === 0) {
            res.status(400).json({ msg: "Faculty doesn't exist" })
        }
        else {
            res.status(201).json({ msg: "Faculty deleted succefully" });
        }
    }
    else {
        res.status(400).json({ mag: "You are not allowed to delete faculties" });
    }}
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.put('/faculty/:id', isLogged, async (req, res) => {
    try{
    const staff_member = jwt.verify(req.header.token, securitKey);
    let update_value = {};
    if (req.body.name) {
        update_value.name = req.body.name;
    }
    if (req.body.departments) {
        update_value.departments = req.body.departments;
    }
    if (staff_member.role === "HR") {
        faculty.update({ _id: req.params.id }, { $set: update_value }, (err, succ) => {
            if (err) {
                return res.json({ msg: err });
            }
            return res.json({ msg: "Record updated successfully" })
        })
    }
    else {
        res.status(400).json({ msg: "You are not allowed to edit fuclties" });
    }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.post('/department', isLogged, async (req, res) => {
    //TODO: validate data,change password
    try{
        const department_schema = Joi.object({
            name: Joi.string().required(),
            faculty_id:Joi.string().required(),
            hod:Joi.string().required(),
            courses:Joi.array().items(Joi.string()),
        })
        const { error } = department_schema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
           return res.status(400).json(msg);
        }
    const staff_member = jwt.verify(req.header.token, securitKey);
    if (staff_member.role === "HR") {
        let { name, faculty_id, hod} = req.body;
        let courses = (req.body.courses)? req.body.courses:[];
        const new_department = new department({
            name: name,
            faculty_id: faculty_id,
            hod: hod,
            courses: courses
        });
        const saved_department = await new_department.save();
        res.json(saved_department);
    }
    else {
        res.status(400).json({ mag: "You are not allowed to add departments" })
    }}
    catch (error) {
        res.status(400).json({ message: error.message })
    }

});
app.delete('/department/:id', isLogged, async (req, res) => {
    try{
    const staff_member = jwt.verify(req.header.token, securitKey);
    if (staff_member.role === "HR") {
        const deleted = await department.deleteOne({ _id: req.params.id });
        if (deleted.deletedCount === 0) {
            res.status(400).json({ msg: "department doesn't exist" })
        }
        else {
            res.status(201).json({ msg: "department deleted succefully" });
        }
    }
    else {
        res.status(400).json({ msg: "You are not allowed to delete departments" })
    }
} 
catch (error) {
    res.status(400).json({ message: error.message })
}
});
app.put('/department/:id', isLogged, async (req, res) => {
    try{
    const staff_member = jwt.verify(req.header.token, securitKey);
    let update_value = {};
    if (req.body.name) {
        update_value.name = req.body.name;
    }
    if (req.body.hod) {
        update_value.hod = req.body.hod;
    }
    if (req.body.faculty_id) {
        update_value.faculty_id = req.body.faculty_id;
    }
    if (req.body.courses) {
        update_value.courses = req.body.courses;
    }
    if (staff_member.role === "HR") {
        department.update({ _id: req.params.id }, { $set: update_value }, (err, succ) => {
            if (err) {
                return res.json({ msg: err });
            }
            return res.json({ msg: "Record updated successfully" })
        })
    }
    else {
        res.status(400).json({ msg: "You are not allowed to edit departments" });
    }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.post('/course', isLogged, async (req, res) => {
    
    try{
        const course_schema = Joi.object({
            name: Joi.string().required(),
            department_id:Joi.string().required(),
            coordinator:Joi.number(),
            slots:Joi.array().items(Joi.string()),
            required_slots:Joi.number().required()
        })
        const { error } = course_schema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
           return res.status(400).json(msg);
        }
    const staff_member = jwt.verify(req.header.token, securitKey);
    if (staff_member.role === "HR") {
        let { name, department_id, coordinator ,required_slots} = req.body;
        let slots = (req.body.slots)?req.body.slots:[];
        const new_course = new course({
            name: name,
            department_id: department_id,
            coordinator: coordinator,
            slots: slots,
            required_slots:required_slots
        });
        const saved_course = await new_course.save();
        res.json(saved_course);
    }
    else {
        res.status(400).json({ mag: "You are not allowed to add courses" })
    }
}catch (error) {
    res.status(400).json({ message: error.message })
}
});
app.delete('/course/:id', isLogged, async (req, res) => {
    try{
    const staff_member = jwt.verify(req.header.token, securitKey);
    if (staff_member.role === "HR") {
        const deleted = await course.deleteOne({ _id: req.params.id });
        if (deleted.deletedCount === 0) {
            res.status(400).json({ msg: "Course doesn't exist" })
        }
        else {
            res.status(201).json({ msg: "Course deleted succefully" });
        }
    }
    else {
        res.status(400).json({ mag: "You are not allowed to delete courses" })
    }}
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.put('/course/:id', isLogged, async (req, res) => {
  
    const staff_member = jwt.verify(req.header.token, securitKey);
    let update_value = {};
    try{
        const course_schema = Joi.object({
            name: Joi.string(),
            department_id:Joi.string(),
            coordinator:Joi.number(),
            slots:Joi.array().items(Joi.string()),
            required_slots:Joi.number()
        })
        const { error } = course_schema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
           return res.status(400).json(msg);
        }
    if (req.body.name) {
        update_value.name = req.body.name;
    }
    if (req.body.department_id) {
        update_value.department_id = req.body.department_id;
    }
    if (req.body.required_slots) {
        update_value.required_slots = req.body.required_slots;
    }
    if (req.body.coordinator) {
        update_value.coordinator = req.body.coordinator;
    }
    if (req.body.slots) {
        update_value.slots = req.body.slots;
    }
    if (staff_member.role === "HR") {
        course.update({ _id: req.params.id }, { $set: update_value }, (err, succ) => {
            if (err) {
                return res.json({ msg: err });
            }
            return res.json({ msg: "Record updated successfully", succ });
        })
    }
    else {
        res.status(400).json({ msg: "You are not allowed to edit courses" });
    }
    }

    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
// app.post('/office', async (req, res) => {
//     let office1 = {
//         name: "C7 305",
//         capacity: 5,
//         staff_members: ["5fde7fa88ebe7623f0a03cd0"]
//     };
//     const new_office = new office(office1);
//     const saved_office = await new_office.save();
//     res.json(saved_office);
// });


app.post('/staff', isLogged, async (req, res) => {
   try{
    const logged_user = jwt.verify(req.header.token, securitKey);
    const registerSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        day_off: Joi.number(),
        salary: Joi.number().required().min(1),
        role: Joi.string().required(),
        office_id: Joi.string().required(),
        gender:Joi.string(),
        department_id:Joi.string()
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        return res.status(400).json(msg);
    }
    if (logged_user.role === "HR") {
        // if (req.body.role === "HR") req.body.id = "hr-" + hr;
        // else req.body.id = "ac-" + ac;
        let { name, email, salary, office_id, role } = req.body;
        const salt = await bcrypt.genSalt();
        const hashpassword = await bcrypt.hash("123456", salt);

        let added_atributes = {
            name: name,
            email: email,
            salary: salary,
            office: office_id,
            password: hashpassword,
            role: role,
        };
        if (req.body.day_off) {
            added_atributes.day_off = req.body.day_off;
        }
        if (req.body.gender) {
            added_atributes.gender = req.body.gender;
        }
        if (req.body.department_id) {
            added_atributes.department_id = req.body.department_id;
        }
        const found_office = await office.findOne({ _id: office_id });
        if (found_office) {
            if (!(found_office.staff_members) || (found_office.capacity - found_office.staff_members.length) > 0) {
                const new_staff_member = new staff_member(added_atributes);
                const saved_staff_member = await new_staff_member.save();
                let arry_members = (found_office.staff_members) ? found_office.staff_members : [];
                arry_members.push(saved_staff_member._id);
                console.log(found_office.staff_members);
                console.log(arry_members);
                await office.update({ _id: office_id }, { $set: { staff_members: arry_members } })

                res.json({ staff: saved_staff_member });
            }
            else {
                res.status(400).json({ msg: "the office is already full" })
            }

        }
        else {
            res.status(400).json({ msg: "This office doesn't exist" })
        }

    }
    else {
        res.status(400).json({ mag: "You are not allowed to add staff members" })
    }
}
catch (error) {
    res.status(400).json({ message: error.message })
}
});



app.delete('/staff/:id', isLogged, async (req, res) => {
    try{
    const logged_user = jwt.verify(req.header.token, securitKey);
    if (logged_user.role === "HR") {
        const deleted = await staff_member.deleteOne({ _id: req.params.id });
        if (deleted.deletedCount === 0) {
            res.status(400).json({ msg: "Member doesn't exist" })
        }
        else {
            res.status(201).json({ msg: "Member deleted succefully" });
        }
    }
    else {
        res.status(400).json({ mag: "You are not allowed to delete Members" });
    }
}catch (error) {
    res.status(400).json({ message: error.message })
}
});
app.put('/staff/:id', isLogged, async (req, res) => {
    try{
    const logged_user = jwt.verify(req.header.token, securitKey);
    const upadte_user_schema = Joi.object({
        day_off: Joi.number(),
        salary: Joi.number(),
        role: Joi.string(),
        office_id: Joi.string(),
    });
    const { error } = upadte_user_schema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        return res.status(400).json(msg);
    }
    if (logged_user.role === "HR") {
        let update_value = {};
        if (req.body.day_off) {
            update_value.day_off = req.body.day_off;
        }
        if (req.body.salary) {
            update_value.salary = req.body.salary;
        }
        if (req.body.role) {
            update_value.role = req.body.role;
        }
        if (req.body.office_id) {
            if (found_office) {
                if (!(found_office.staff_members) || (found_office.capacity - found_office.staff_members.length) > 0) {
                    update_value.office = req.body.office;
                    let arry_members = (found_office.staff_members) ? found_office.staff_members : [];
                    arry_members.push(saved_staff_member._id);
                    await office.update({ _id: office_id }, { $set: { staff_members: arry_members } })
                }
                else {
                    res.status(400).json({ msg: "the office is already full" })
                }

            }
        }

        staff_member.update({ _id: req.params.id }, { $set: update_value }, (err, succ) => {
            if (err) {
                return res.json({ msg: err });
            }
            return res.json({ msg: "Record updated successfully", succ });
        })
    }
    else {
        res.status(400).json({ mag: "You are not allowed to edit Members" });
    }
}catch (error) {
    res.status(400).json({ message: error.message })
}
});
app.put('/removemissingdays/:id',isLogged,async(req,res)=>{
    try{
        const logged_user = jwt.verify(req.header.token, securitKey);
        if (logged_user.role === "HR") {
            if(logged_user._id === req.params.id){
                return res.status(401).json({msg:"You arenot allowed to edit your attendance!"})
            }
            else{
                staff_member.findOne({_id:req.params.id}).then((staff)=>{
                let log =staff.log.filter((day)=>{
                return !(day.absent) || !(day.absent.toDateString===req.body.date);
                    });
                staff_member.updateOne({_id:req.params.id},{log:log}).then((updated)=>{
                    res.status(200).json({msg:"missing day removed successfully"});
                }).catch((err)=>{
                    res.status(400).json({err});
                })
                })    
            }
        }
        else{
            res.status(401).json({msg:"You are not allowed alter missing days "})
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.get('/viewstaffmissingdays',isLogged,(req,res)=>{
        try{
            const logged_user = jwt.verify(req.header.token, securitKey);
            if (logged_user.role === "HR") {
                    staff_member.find().then((users)=>{
                        missing_days= users.filter((user)=>{
                            return (user.missing_day);
                        }); 
                        missing_hours= users.filter((user)=>{
                            return (user.missing_hours);
                        });
                        res.status(200).json({
                            "staff with missing days"  :missing_days,
                            "staff with missing hours" :missing_hours})
                    }).catch((err)=>{
                        res.status(400).json({err});
                    })
            }
            else{
                res.status(401).json({msg:"You are not allowed to view staff missing days"});
            }
        }
        catch (error) {
            res.status(400).json({ message: error.message })
        }
});
// =====================================================================================================================
// =====================================================================================================================
//____________________________HOD_____________________________________________________

app.post('/courseinstructor', isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const course_instructor_schema = Joi.object({
            course_id: Joi.string().required(),
            instructor_id: Joi.string().required(),
        });
        const { error } = course_instructor_schema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
            return res.status(400).json(msg);
        }
        if (logged_user.role === "HOD") {
            let { course_id, instructor_id } = req.body;
            let head_of_department = await staff_member.findOne({ _id: logged_user.id });
            let new_record = new course_assignment({
                course: course_id,
                instructor: instructor_id,
                department_id: head_of_department.department_id
            });
            let saved_record = await new_record.save();
            res.status(200).json({ msg: "Assignment added successfully", saved_record });
        }
        else {
            res.status(400).json({ msg: "You are not allowed to add instructor assignments" })
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.put('/courseinstructor', isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const course_instructor_schema = Joi.object({
            course_id: Joi.string().required(),
            instructor_id: Joi.string().required(),
        });
        const { error } = course_instructor_schema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
            return res.status(400).json(msg);
        }
        if (logged_user.role === "HOD") {
            let { course_id, instructor_id } = req.body;
            let assigned_record = await course_assignment.findOne({ instructor: instructor_id, course: course_id });
            let head_of_department = await staff_member.findOne({ _id: logged_user.id });
            if (!(assigned_record)) {
                return res.status(404).json({ msg: "Course assignment not found" })
            }
            if (assigned_course.department_id === head_of_department.departement_id) {
                var updated_value = {
                    course: course_id,
                    instructor: instructor_id
                };
                course_assignment.updateOne({ _id: assigned_record._id }, updated_value).then(() => {
                    return res.status(200).json({ msg: "Instructor assigned successfully" })
                }).catch(() => {
                    return res.status(500).json({ msg: "Couldn't assign/update instructor" });
                });

            }
            else {
                res.status(400).json({ msg: "You are not allowed to assign courses outside your department" })
            }
        }
        else {
            res.status(400).json({ msg: "You are not allowed to edit instructor assignments" })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.delete('/courseinstructor', isLogged, async (req, res) => {
    try {
        const course_instructor_schema = Joi.object({
            course_id: Joi.string().required(),
            instructor_id: Joi.string().required(),
        });
        const { error } = course_instructor_schema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
            return res.status(400).json(msg);
        }
        const logged_user = jwt.verify(req.header.token, securitKey);
        if (logged_user.role === "HOD") {
            let { course_id, instructor_id } = req.body;
            let assigned_record = await course_assignment.findOne({ instructor: instructor_id, course: course_id });
            let head_of_department = await staff_member.findOne({ _id: logged_user.id });
            if (!(assigned_record)) {
                return res.status(404).json({ msg: "Course assignment not found" })
            }
            if (assigned_course.department_id === head_of_department.departement_id) {
                var deleted_filter = {
                    course: course_id,
                    instructor: instructor_id
                };
                course_assignment.deleteOne(deleted_filter).then(() => {
                    return res.status(201).json({ msg: "Assignment deleted assigned successfully" })
                }).catch(() => {
                    return res.status(500).json({ msg: "Couldn't delete assignment" });
                });

            }
            else {
                res.status(400).json({ msg: "You are not allowed to delete course instructors outside your department" })
            }
        }
        else {
            res.status(400).json({ msg: "You are not allowed to delete instructors" })
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.get('/viewstaff', isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        if(logged_user.role === "HR"){
            staff_member.find().then((staff)=>{
                res.json(staff);
        });
        }
        else{
        if (logged_user.role === "HOD") {
            let instructors = await course_assignment.find({ department_id: logged_user.departement_id });
            res.status(200).json({ instructors });
        }
        else {
          
            res.status(400).json({ msg: "You are not allowed to view staff members day off" });
        }
    }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.get('/viewdayoff', isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        if (logged_user.role === "HOD") {
            let instructors = await staff_member.find({ department_id: logged_user.departement_id }, { day_off: 1 });
            res.status(200).json({ instructors });
        }
        else {
            //To be changed
            res.status(400).json({ msg: "You are not allowed to view staff members day off" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.get('/viewdayoff/:id', isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        if (logged_user.role === "HOD") {
            let instructor = await staff_member.findOne({ _id: req.params.id, department_id: logged_user.departement_id }, { day_off: 1 });
            res.status(200).json({ instructor });
        }
        else {
            //To be changed
            res.status(400).json({ msg: "You are not allowed to view staff members day off" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
app.get('/getallrequests',isLogged,(req,res)=>{
    Request.find().then((resp)=>{
        res.json(resp);
    }).catch((err)=>{
        res.status(400).json(err)
    })
})
app.get('/viewrequest', isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        if (logged_user.role === "HOD") {
            let requests = await staff_member.find({ _id: logged_user.id }, { receivedRequests: 1 });
            res.status(200).json({ requests });
        }
        else {
            //To be changed
            res.status(400).json({ msg: "You are not allowed to view staff members requests" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.put('/rejectrequest/:id', isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const reject_request_schema = Joi.object({
            comment: Joi.string()
        });
        const { error } = reject_request_schema.validate(req.body);
        if (error) { 
            const msg = error.details.map(el => el.message).join(",");
            return res.status(400).json(msg);
        }
        if (logged_user.role === "HOD") {
            await Request.update({ _id: req.params.id },{$set: {
                status: 'rejected',
                comment: req.body.comment
            }}).then((res) => {
                res.status(200).json({ msg: "request Rejected successfully" })
            }).catch((err) => {
                res.status(400).json({ msg: err});
            });

        }
        else {
            //To be changed
            res.status(400).json({ msg: "You are not allowed to view staff members requests" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.get('/viewcourseassignment', isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        if (logged_user.role === "HOD") {
            course_assignment.find({ departement_id: logged_user.departement_id }).then((found) => {
               
                res.status(200).json(found);
            }).catch((err) => {
                res.status(400).json({ err });
            });
        }
        else {
            res.status(400).json({ msg: "you cannot view course assignment" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.get('/viewcoursecoverage/:id', isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        if (logged_user.role === "HOD") {
            course.findOne({ _id: req.params.id, departement_id: logged_user.departement_id }).then((fetched_course) => {
                let coverage = (fetched_course.slots.length) / (fetched_course.required_slots);
                res.status(200).json({ coverage })
            }).catch((err)=>{
                res.status(400).json({err});
            });
        }
        else {
            res.status(400).json({ msg: "you cannot view course coverage" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
//TO be handeled    
app.put('/acceptrequest/:id',isLogged,async (req,res)=>{
    try{
        const logged_user = jwt.verify(req.header.token, securitKey);
        const my_request = Request.findOne({_id:req.params.id});
        if (logged_user.role === "HOD") {
            if((my_request.Boss !== logged_user._id)){ 
                res.status(401).json({msg:"you are not allowed to accept this request"});
            }
            else{
                await Request.updateOne({ _id: req.params.id }, {
                    status: 'accepted',
                }).then(async (res) => {
                   await handel_request(req.params.id,req.body);
                   await notify_staff(logged_user);
                    res.status(200).json({ msg: "request  Accepted successfully" })
                }).catch((err) => {
                    res.status(400).json({ msg: err.msg});
                });
            }
        }
        else{
            if(!(my_request.theAcademicMemberReplacementID !== logged_user._id)){
                res.status(401).json({msg:"you are not allowed to accept this request"});
            }
            else{

            }
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

// =====================================================================================================================
// =====================================================================================================================
//!____________________academic member_________________

//!HELPER ROUTES IN FRONT END=====================
app.get("/allStaffMemberIDs", isLogged, async (req, res) => {
    try {
        const result = await staff_member.find({}, { _id: 1 })
        res.json(result)

    } catch (error) {
        res.status(400).json(error);
    }
})

app.get("/allCourses", isLogged, async (req, res) => {
    try {
        const result = await course.find({}, { _id: 1, name: 1 })
        res.json(result)

    } catch (error) {
        res.status(400).json(error);
    }
})

app.post("/allSlots", async (req, res) => {
    try {
        const slotArr = await slot.find({},
            { location: 1, course_id: 1, time: 1 });
        const result = []
        for (let index = 0; index < slotArr.length; index++) {
            const slotInfo = slotArr[index];
            const locationName = (await location.findOne({ _id: slotInfo.location })).name
            const courseName = (await course.findOne({ _id: slotInfo.course_id })).name
            const courseCoordinator = (await course.findOne({ _id: slotInfo.course_id })).coordinator
            const time = moment.utc(slotInfo.time).toDate().getUTCHours();
            const final = {
                _id: slotInfo._id,
                locationName: locationName,
                courseName: courseName,
                courseCoordinator: courseCoordinator,
                time: time
            }
            result.push(final)
        }
        res.json(result)

    } catch (error) {
        res.status(400).json(error);
    }
})

app.post("/getCancelRequest", isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const Allrequests = (await staff_member.findOne({ _id: acdMemID })).sentRequests;
        let result = [];
        for (let index = 0; index < Allrequests.length; index++) {
            const requestID = Allrequests[index];
            const currentReq = await Request.findOne({ _id: requestID },
                {
                    type: 1, status: 1, theAcademicMemberReplacementID: 1,
                    submittedDay: 1, targetedDay: 1, Boss: 1,
                    desiredSlot: 1, desiredDayOff: 1, reason: 1
                }
            )
            if (currentReq.status === "pending" || currentReq.targetedDay > new Date)
                result.push(currentReq);
        }
        res.json(result)
    } catch (error) {
        res.status(400).json(error.message)
    }

})

//!============================
app.get("/viewSchedule", isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const schedule = (await staff_member.findOne({ _id: acdMemID })).schedule; //when we create staffMem should have schedule property chnge to findById
        const result = [];
        let resultSlot = [];
        for (let index = 0; index < schedule.length; index++) {
            const scheduleID = schedule[index];
            const currentScheduleDay = await Schedule.findOne({ _id: scheduleID },
                { day: 1, slot: 1 });
            if (currentScheduleDay != null) {
                for (let j = 0; j < currentScheduleDay.slot.length; j++) {
                    const slotID = currentScheduleDay.slot[j];
                    const slotInfo = await slot.findOne({ _id: slotID },
                        { location: 1, course_id: 1, time: 1 });

                    const locationName = (await location.findOne({ _id: slotInfo.location })).name
                    const courseName = (await course.findOne({ _id: slotInfo.course_id })).name
                    const time = moment.utc(slotInfo.time).toDate().getUTCHours();
                    const finalSlotObj = {
                        locationName: locationName,
                        courseName: courseName,
                        time: time
                    }
                    resultSlot.push(finalSlotObj)
                }
                const finalScheduleObj = {
                    day: currentScheduleDay.day,
                    slot: resultSlot
                }
                resultSlot = []
                result.push(finalScheduleObj);
            }

        }

        res.json(result);
        /*
        {
                const slotsArray = currentScheduleDay.slot
                const resultSlotArray = [];
                for (let j = 0; j < slotsArray.length; j++) {
                    const slotID = slotsArray[j];
                    const slotInfo = await slot.findOne({ _id: slotID },
                        { location: 1, course_id: 1, time: 1 });
                    if (slotInfo != null) {
                        const locationRender = (await location.findOne({ _id: slotInfo.location })).name;
                        const courseNameRender = (await course.findOne({ _id: slotInfo.course_id })).name;
                        const timeRender = slotInfo.time.toUTCString()
                        const newSlotRender = {
                        location : locationRender,
                        course_id : courseNameRender,
                        time : timeRender
                        }
                        resultSlotArray.push(newSlotRender)

                    }
                    currentScheduleDay.slot = resultSlotArray
                }
                result.push(currentScheduleDay);
            }
        */
    }
    catch (error) {
        res.status(400).json(error);
    }

});

app.get("/viewReplacement", isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const Allrequests = (await staff_member.findOne({ _id: acdMemID })).sentRequests; //when we create staffMem should have schedule property chnge to findById
        const result = [];
        for (let index = 0; index < Allrequests.length; index++) {
            const requestID = Allrequests[index];
            const currentReq = await Request.findOne({ _id: requestID, type: "replacement" },
                {
                    type: 1, status: 1, theAcademicMemberReplacementID: 1,
                    submittedDay: 1, targetedDay: 1, Boss: 1
                });
            if (currentReq != null)
                result.push(currentReq);
        }
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }


});

//should be send to someone who is not busy same department and same course
app.post("/sendReplacementMEM", isLogged, async (req, res) => {
    try {
        const { error } = replacementReqMEMValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message)
        }
        //5fde66793c9a502ea48ffa9a 5fde66793c9a502ea48ffa9a
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const acdMem = await staff_member.findOne({ _id: acdMemID });
        const replacementMemID = req.body.theAcademicMemberReplacementID;

        const replacementAcdMem = await staff_member.findOne({ _id: replacementMemID });
        let isBusy
        let sameDepart = true;
        //check same depart
        if (acdMem.departement_id + "" == replacementAcdMem.departement_id + "")
            sameDepart = true
        else
            sameDepart = false
        if (!sameDepart) return res.status(400).json("sorry this member is not in the same department")

        //check same course
        const courseID = req.body.course_id;
        const arrCourses = replacementAcdMem.course_id;
        const sameCourse = arrCourses.some((course) => course == courseID);

        if (!sameCourse) return res.status(400).json("sorry this member doesn't teach this course")


        //check is busy 
        //  const targetedDay = moment.utc(req.body.targetedDay).toDate().getDate();
        const targetedDay = req.body.targetedDay;
        const schedule = await Schedule.findOne({ _id: replacementAcdMem.schedule[targetedDay] },
            { day: 1, slot: 1 });
        (schedule.slot.length == 0) ? isBusy = false : isBusy = true;
        if (isBusy) return res.status(400).json("sorry this member is busy")


        // can send the req >> set proper request  
        req.body.type = "replacement";
        req.body.status = "pending";
        req.body.theRequstingAcademicMemberID = acdMemID;
        req.body.submittedDay = new Date().toUTCString();
        const newReq = new Request(req.body)
        const savedReq = await newReq.save();
        acdMem.sentRequests.push(savedReq._id);
        replacementAcdMem.receivedRequests.push(savedReq._id);
        const newSent = acdMem.sentRequests;
        const newRecieved = replacementAcdMem.receivedRequests;


        await staff_member.updateOne(
            { _id: acdMemID }, { $set: { sentRequests: newSent } }
        )

        await staff_member.updateOne(
            { _id: replacementMemID }, { $set: { receivedRequests: newRecieved } }
        )


        res.json({ message: "Request has been sent successfully" })


    } catch (error) {
        res.status(400).json({ message: error.message })
    }



})

app.post("/sendReplacementHOD", isLogged, async (req, res) => {
    const { error } = replacementReqHODValidation(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message)
    }
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const acdMem = await staff_member.findOne({ _id: acdMemID });
        // submit to HOD after accpetance or rejection
        const BossID = (await department.findOne({ _id: acdMem.departement_id })).hod;
        const Boss = await staff_member.findOne({ _id: BossID });

        // can send the req >> set proper request  
        req.body.type = "replacement";
        req.body.status = "pending";
        req.body.theRequstingAcademicMemberID = acdMemID;
        req.body.submittedDay = new Date().toUTCString();
        req.body.Boss = Boss._id;


        const newReq = new Request(req.body)
        const savedReq = await newReq.save();
        // console.log(savedReq._id)

        acdMem.sentRequests.push(savedReq._id);
        Boss.receivedRequests.push(savedReq._id);
        const newSent = acdMem.sentRequests;
        const newRecieved = Boss.receivedRequests;


        await staff_member.updateOne(
            { _id: acdMemID }, { $set: { sentRequests: newSent } }
        )

        await staff_member.updateOne(
            { _id: BossID }, { $set: { receivedRequests: newRecieved } }
        )
        res.json({ message: "Request has been sent successfully" })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

})

//================slot linking===========================

app.post("/sendSlotLinking", isLogged, async (req, res) => {
    const { error } = slotLinkingReqValidation(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message)
    }
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const acdMem = await staff_member.findOne({ _id: acdMemID });
        const Boss = await staff_member.findOne({ _id: req.body.co });

        // can send the req >> set proper request  
        req.body.type = "slot linking";
        req.body.status = "pending";
        req.body.theRequstingAcademicMemberID = acdMemID;
        req.body.submittedDay = new Date().toUTCString();


        const newReq = new Request(req.body)
        const savedReq = await newReq.save();
        acdMem.sentRequests.push(savedReq._id);
        Boss.receivedRequests.push(savedReq._id);
        const newSent = acdMem.sentRequests;
        const newRecieved = Boss.receivedRequests;


        await staff_member.updateOne(
            { _id: acdMemID }, { $set: { sentRequests: newSent } }
        )

        await staff_member.updateOne(
            { _id: req.body.co }, { $set: { receivedRequests: newRecieved } }
        )
        res.json({ message: "Request has been sent successfully" })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

})

//===================Change day Off ==================
app.post("/changeDayOff", isLogged, async (req, res) => {
    const { error } = changeDayOffReqValidation(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message)
    }
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const acdMem = await staff_member.findOne({ _id: acdMemID });
        // submit to HOD after accpetance or rejection
        const BossID = (await department.findOne({ _id: acdMem.departement_id })).hod;
        const Boss = await staff_member.findOne({ _id: BossID });

        // can send the req >> set proper request  
        req.body.type = "change day off";
        req.body.status = "pending";
        req.body.theRequstingAcademicMemberID = acdMemID;
        req.body.submittedDay = new Date().toUTCString();
        req.body.Boss = Boss._id;


        const newReq = new Request(req.body)
        const savedReq = await newReq.save();
        //console.log(savedReq._id)

        acdMem.sentRequests.push(savedReq._id);
        Boss.receivedRequests.push(savedReq._id);
        const newSent = acdMem.sentRequests;
        const newRecieved = Boss.receivedRequests;


        await staff_member.updateOne(
            { _id: acdMemID }, { $set: { sentRequests: newSent } }
        )

        await staff_member.updateOne(
            { _id: BossID }, { $set: { receivedRequests: newRecieved } }
        )
        res.json({ message: "Request has been sent successfully" })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

})

//===================leave requests=============================
app.post("/leaveRequests", isLogged, async (req, res) => {
    const { error } = leaveReqValidation(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message)
    }
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const acdMem = await staff_member.findOne({ _id: acdMemID });
        console.log("file: app.js ~ line 1799 ~ acdMem.departement_id", acdMem.departement_id)
        // submit to HOD after accpetance or rejection
        const BossID = (await department.findOne({ _id: acdMem.departement_id })).hod;
        const Boss = await staff_member.findOne({ _id: BossID });

        req.body.status = "pending";
        req.body.theRequstingAcademicMemberID = acdMemID;
        req.body.submittedDay = new Date().toISOString().slice(0, 10);
        req.body.Boss = Boss._id;

        const submittedDay = moment.utc(req.body.submittedDay).toDate();//should be change to now
        const targetedDay = moment.utc(req.body.targetedDay).toDate();
        const diffTime = submittedDay - targetedDay;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        //console.log(diffDays);
        //  if (diffDays < 0) res.status(400).json("you can't post " + req.body.type + " request before your " + req.body.type + " day");

        //accidental leave
        if (req.body.type == "accidental") {

        };

        //sick leave
        if (req.body.type == "sick") {

            if (diffDays > 3) res.status(400).json("you can't post sick request after 3 dayes from your sick day");
        };

        //maternity leave
        if (req.body.type == "maternity") {
            if (acdMem.gender == "male") res.status(400).json("you can't post maternity request as you're male")
        };

        //compensation leave
        if (req.body.type == "compensation") {
            if (!req.body.reason) res.status(400).json("you must put a reason for your compensation request")

        };



        const newReq = new Request(req.body)
        const savedReq = await newReq.save();
        //console.log(savedReq._id)

        acdMem.sentRequests.push(savedReq._id);
        Boss.receivedRequests.push(savedReq._id);
        const newSent = acdMem.sentRequests;
        const newRecieved = Boss.receivedRequests;


        await staff_member.updateOne(
            { _id: acdMemID }, { $set: { sentRequests: newSent } }
        )

        await staff_member.updateOne(
            { _id: BossID }, { $set: { receivedRequests: newRecieved } }
        )
        res.json({ message: "Request has been sent successfully" })

    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
//===================view Status===================
app.get("/viewStatus/:status", isLogged, async (req, res) => {

    try {
        if (req.params.status != "all" && req.params.status != "pending" && req.params.status != "accepted" && req.params.status != "rejected")
            return res.status(400).json("write valid params")
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const Allrequests = (await staff_member.findOne({ _id: acdMemID })).sentRequests; //when we create staffMem should have schedule property chnge to findById
        let result = [];
        let key = {}
        if (req.params.status != "all")
            key = { status: req.params.status }
        for (let index = 0; index < Allrequests.length; index++) {
            const requestID = Allrequests[index];
            key = { ...key, _id: requestID }
            const currentReq = await Request.findOne(key,
                {
                    type: 1, status: 1, theAcademicMemberReplacementID: 1,
                    submittedDay: 1, targetedDay: 1, Boss: 1,
                    desiredSlot: 1, desiredDayOff: 1, reason: 1
                }
            );
            if (currentReq != null)
                result.push(currentReq);
        }
        return res.json(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }


})



//=====================view notifications==============
app.get("/notifications", isLogged, async (req, res) => {
    try {
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const notifications = (await staff_member.findOne({ _id: acdMemID })).notifications; //when we create staffMem should have schedule property chnge to findById
        res.json(notifications);
    } catch (error) {
        res.status(400).json(error);
    }

})

//================== cancel request ====================
app.delete("/cancelRequest/:requestID", isLogged, async (req, res) => {

    try {
        if (!req.params.requestID) res.status(400).json("requestID is required");
        const logged_user = jwt.verify(req.header.token, securitKey);
        const acdMemID = logged_user.id;
        const requestID = req.params.requestID;
        const Allrequests = (await staff_member.findOne({ _id: acdMemID })).sentRequests; //when we create staffMem should have schedule property chnge to findById
        const checkRequest = Allrequests.some((element) => element == requestID)
        if (!checkRequest) res.status(400).json("you didn't send such request");

        const currentReq = await Request.findOne({ _id: requestID });
        if (currentReq != null) {

            if (currentReq.status == "pending" || currentReq.targetedDay > new Date())
                await Request.deleteOne(
                    { _id: requestID }   
                )
            const newAllRequest = Allrequests.filter((element) => element != requestID)
            await staff_member.updateOne(
                { _id: acdMemID }, { $set: { sentRequests: newAllRequest } }
            )
        }
        else {
            res.status(400).json(`"request not found"`)
        }

        return res.json("request "+requestID+ " has been cancelled")
    } catch (error) {
        res.status(400).json({ message: error.message })
    }


});


// =====================================================================================================================
// =====================================================================================================================
//_______________________________________________Course instructor_______________________________________


//view other instrcuters in the same departement 
// we will pass in the body of the request the id of the instructer 
// and the departement id and in every departement there is an array of id's 
//refrencing the Staff members schema 
//the route for viewing other instrcuters in the same departement will be => routes/instructer/fellas


app.get('/departement/fellas',isLogged,async (req, res) => {
    try {
        // the id should not be bassed in the body but taken 
        // from the token 
        const logged_user = jwt.verify(req.header.token, securitKey);

        let { _id } = logged_user.id;
        const person = await staffMem.findById(_id)
        const departement_id = person.depratemet_id;
        const dep = await departement.findOne({ _id: departement_id });
        const ids = dep.staffMember_id;
        const fella = await staffMem.find({ _id: ids });
        res.send(fella);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

});



/*viewing other members in a specific course ~~ 
we send the course ID in the the body at the route /course/fellas
and it well retrive all the members who are in that specific course  */
app.get('/course/fellas/:id',isLogged,async (req, res) => {
    try {
        // u have to authinticate first 

        // note that i changed the the instructer in the course assgnment schema 
        // from a singleton to an array 
        const logged_user = jwt.verify(req.header.token, securitKey);

        let { course_id } = logged_user.id;
      //  let { course_id } = req.params.id;
        const this_course = await courses.findOne({ _id: course_id });
        const this_course_assignment_id = this_course.course_assignment;
        const this_course_assignment = course_assignment.findById(this_course_assignment_id);
        const fellas_ids = this_course_assignment.instructor;
        const fellas = staffMem.find({ _id: fellas_ids });
        res.json({ fellas });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

});
/* view all the slots that an acadimic member is assigned to across 
all the cources 
over the route  /acadimic/assigment */
app.get('/acadimic/assigment/:id',isLogged,async (req, res) => {

    // u have to authinticate first 

    // the acadiic _id should be taken from the 
    // login token not from the body 

    try {
        const logged_user = jwt.verify(req.header.token, securitKey);

        let { my_id } = logged_user.id;
     //   let my_id = req.params.id;
        const SLOT = slot.find({ instructor: my_id })
        res.json(SLOT);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

});
/*viewing the slots of a specific course,and the assiged member to 
   this solt will be within the retrieved object "slot" 
   we will send the id of the course as an argoument in the body 
   over the route  /course/assigment */
app.get('/course/assigment/:id',isLogged,async (req, res) => {

    // u have to authinticate first 
    try {

        let { course_id } = req.params.id;
        const course = await courses.findOne({ _id: course_id });
        const slots_id = course.slots;
        const SLOT = await slot.find({ _id: slots_id });
        res.json(SLOT);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

});


/*in this route we assign an acadiminc member to an unassigned slot 
in a specific course on the route course/assign/acadimic
  */
app.post('/course/assign/acadimic',isLogged,async (req, res) => {
    try {
///to be reimplemented

        // the instructer  should be taken from the 
        // login token not from the body

        // note that the acadimic _id that is in the body is the id of the 
        //staff being assigned o the slot  not the instructer that is assgining him 
        // so u have to just authinticate here and remove nothing from 
        // body of the request .
     

        let { course_id, acadimic_id, slot_id } = req.body;
        const this_member = await staffMem.findById(acadimic_id);
        const this_course = await courses.findById(course_id);
        const this_course_assignment_id = this_course.course_assignment;
        const member_course_assignment_ids = this_member.course_assignment;
        const filter = member_course_assignment_ids.filter(id => id === this_course_assignment_id);
        if (!filter) {
            res.send("this member that you are trying to assign him is not a member of this course ");
        }
        // i check if he is a professor not a ta so change it according to ur schema 
        if (this_member.role != "instructor") {
            res.send("You are not allowed to do this action ");
        }

        else {
            const this_slot = await slot.findById(slot_id);
            const slot_instructer = this_slot.instructor;
            if (!slot_instructer) {
                const filter = { _id: slot_id };
                const update = { instructor: acadimic_id };
                const new_slot = await slot.findOneAndUpdate(filter, update);
                res.send(new_slot);
            } else {
                res.send("this slot already have an instructer")
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

});


/* delete an acadimic */
app.post('/course/deleteAssignedAcadimic',isLogged,async (req, res) => {
    try {
        // to be reimplemented
        
        let { course_id, acadimic_id } = req.body;
        const this_member = await staffMem.findById(acadimic_id);
        const this_course = await courses.findById(course_id);
        const this_course_assignment_id = this_course.course_assignment;
        const member_course_assignment_ids = this_member.course_assignment;
        const filter = member_course_assignment_ids.filter(id => id === this_course_assignment_id);
        if (!filter) {
            res.send("this member that you are trying to delete is not a member of this course ");
        }
        // I check if he is a professor not a ta so change it according to ur schema 
        if (this_member.role != "instructer") {
            res.send("You are not allowed to do this action ");
        }

        else {

            //delete from the staff member schema 
            const new_filter = member_course_assignment_ids.filter(id => id != this_course_assignment_id);
            this_course.course_assignment = new_filter;
            await this_course.save();

            // delete from course assignment schema 
            const this_course_assignment = await course_assignment.findById(this_course_assignment_id);
            this_course_assignment.instructor = this_course_assignment.instructor.filter(id => id != acadimic_id);
            await this_course_assignment.save();

            // delte him from all course slots
            const filter = { instructor: acadimic_id, course_id: course_id }
            const update = { $set: { instructor: null } };
            await db.slot.updateMany(filter, update);

        }

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

});

app.post('/course/updateAssignedAcadimic',isLogged,async (req, res) => {
    try {
        //to be reimplemented
        const logged_user = jwt.verify(req.header.token, securitKey);
        if(logged_user.role==='Course instructor'){
        let { course_id, acadimic_id, new_acadimic_id } = req.body;
        const this_member = await staffMem.findById(acadimic_id);
        const this_course = await courses.findById(course_id);
        const this_course_assignment_id = this_course.course_assignment;
        const member_course_assignment_ids = this_member.course_assignment;
        const filter = member_course_assignment_ids.filter(id => id === this_course_assignment_id);
        if (!filter) {
            res.send("this member that you are trying to delete is not a member of this course ");
        }
        // I check if he is a professor not a ta so change it according to ur schema 
        if (this_member.role != "instructer") {
            res.send("You are not allowed to do this action ");
        }

        else {

            //delete from the staff member schema 
            const new_filter = member_course_assignment_ids.filter(id => id != this_course_assignment_id);
            this_course.course_assignment = new_filter;
            await this_course.save();

            // update course assignment schema 
            const this_course_assignment = await course_assignment.findById(this_course_assignment_id);
            this_course_assignment.instructor = this_course_assignment.instructor.filter(id => id != acadimic_id);
            this_course_assignment.instructor.push(new_acadimic_id);
            await this_course_assignment.save();

            //updae slot schema 
            const filter = { instructor: acadimic_id, course_id: course_id }
            const update = { $set: { instructor: new_acadimic_id } };
            await db.slot.updateMany(filter, update);

            //add course assignment to the new staff mem 
            const added_new_member = await staffMem.findById(new_acadimic_id);
            added_new_member.course_assignment.push(this_course_assignment_id);
            await added_new_member.save();

        }

    }
}

    catch (error) {
        res.status(500).json({ error: error.message });
    }

});


/*in this route we set the coordinater of a course to a staff member 
both course id and stafmember i will be sent inside the body 
and that has a route /course/setCoordinater */
app.put('/course/setCoordinater',isLogged,async (req, res) => {
  try{
    const logged_user = jwt.verify(req.header.token, securitKey);
    if(logged_user.role==='Course instructor'){
    const coordinator_schema = Joi.object({
        course_id: Joi.string().required(),
        acadimic_id: Joi.string().required()
    });
    const { error } = coordinator_schema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        return res.status(400).status(400).json(msg);
    } 
    let { course_id, acadimic_id } = req.body;
    const filter = { _id: course_id }
    const update = { coordinator: acadimic_id }
    const result = await courses.findOneAndUpdate(filter, update);
    res.send(result);
    }
    else{
    res.status(401).json({msg:'Youare not allowed to set course coordinaters'});
    }
}
catch (error) {
    res.status(500).json({ error: error.message });
}
});


//______________________________________________________________________________________________________________________________________
//____________________________________________________________________________________________________________________________________
app.listen(port, () => {
    console.log(`This server is running on port ${port}`);
})
