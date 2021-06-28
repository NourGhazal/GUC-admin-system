const Joi = require("joi");

//=====replacement req validation
const replacementReqMEMValidation = (data)=>{
    const schema = Joi.object({
        type : Joi.string().default("replacement"),
        theRequstingAcademicMemberID : Joi.string(),
        theAcademicMemberReplacementID : Joi.number().required(),
        course_id : Joi.string().required(),
        submittedDay : Joi.date().default('now'),
        targetedDay : Joi.number().required(),
        reason : Joi.string(),
        status : Joi.string().default("pending")
    })

    return schema.validate(data);

}

const replacementReqHODValidation = (data)=>{
    const schema = Joi.object({
        type : Joi.string().default("replacement"),
        theRequstingAcademicMemberID : Joi.string(),
        theAcademicMemberReplacementID : Joi.string().default("not found"),
        submittedDay : Joi.date().default('now'),
        targetedDay : Joi.date().greater(Joi.ref("submittedDay")).required(),
        Boss : Joi.string(),
        reason : Joi.string(),
        status : Joi.string().default("pending"),
        comment : Joi.string()
    })

    return schema.validate(data);

}

const slotLinkingReqValidation = (data)=>{
    const schema = Joi.object({
        type : Joi.string().default("slot linking"),
        theRequstingAcademicMemberID : Joi.string(),
        desiredSlot : Joi.string().required(),
        submittedDay : Joi.date().default('now'),
        co : Joi.number().required(),
        reason : Joi.string(),
        status : Joi.string().default("pending"),
        comment : Joi.string()
    })

    return schema.validate(data);

}

const changeDayOffReqValidation = (data)=>{
    const schema = Joi.object({
        type : Joi.string().default("change day off"),
        theRequstingAcademicMemberID : Joi.string(),
        desiredDayOff : Joi.string().required(),
        submittedDay : Joi.date().default('now'),
        Boss : Joi.string(),
        reason : Joi.string(),
        status : Joi.string().default("pending"),
        comment : Joi.string()
    })

    return schema.validate(data);

}

const leaveReqValidation = (data)=>{
    const schema = Joi.object({
        type : Joi.string().required().valid("accidental" , "sick" , "maternity" , "compensation" ),
        theRequstingAcademicMemberID : Joi.string(),
        submittedDay : Joi.date().default('now'),
        targetedDay : Joi.date().required(), //first day of absence
        Boss : Joi.string(),
        reason : Joi.string().default(Joi.ref("type") + "reason"),
        status : Joi.string().default("pending"),
        comment : Joi.string()
    })

    return schema.validate(data);

}

module.exports.replacementReqMEMValidation = replacementReqMEMValidation;
module.exports.replacementReqHODValidation = replacementReqHODValidation;
module.exports.slotLinkingReqValidation = slotLinkingReqValidation;
module.exports.changeDayOffReqValidation = changeDayOffReqValidation;
module.exports.leaveReqValidation = leaveReqValidation;