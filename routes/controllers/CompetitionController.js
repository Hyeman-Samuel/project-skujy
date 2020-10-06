const {CompetitionFormat,CompetitionStage,QuestionSelectionType} = require("../../models/CompetitionFormat");
const {Course} = require("../../models/Course");
const {Attempt}= require("../../models/Attempt");
const {Entry}= require("../../models/Entry")
const {Logger} = require("../../utility/Logger");
const {paginateArray} = require("../../utility/Pagination");


async function createCompetitionFormat(req,res){      
try{   
    if(req.body.SelectedQuestions != ""){
    req.body.SelectedQuestions = JSON.parse(req.body.SelectedQuestions)
    }
    const competition = new CompetitionFormat(req.body);
    const course = await Course.findById(req.params.id).populate(["Questions","Competitions"]);
    if(course == null){
        return {message:"Course Not Found",code:0}
    }

    switch (competition.QuestionSelection) {
        case QuestionSelectionType.AllQuestions:
        if(course.Questions.length < competition.NumberOfQuestions){
            return {message:"Not enough Questions ",code:-1}
        }    
            break;
        case QuestionSelectionType.SelectedQuestions:
        if(competition.SelectedQuestions < competition.NumberOfQuestions){
            return {message:"Not enough Questions ",code:-1}
        }              
            break;
        default:
            if(course.Questions.length < competition.NumberOfQuestions){
                return {message:"Not enough Questions ",code:-1}
            }
            break;
    }
    competition.Stage = CompetitionStage.Registration
    competition.Course = course._id
    await competition.save()
    return {message:"Test Created",code:1, data:{"competition":competition,"course":course} }; 
    }catch(err){
    Logger.error(err.message,err)
    return {message:err._message,code:-1} 
    }
}


async function getAllCompetition(obj){
    try {
        const competition = await CompetitionFormat.find(obj).populate(["Course"]).lean()
        if(competition == null){
            return {message:"Test(s) Not Found",code:0, };    
        }
        return {message:"Test(s) Found",code:1, data:competition }; 
        
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1}
    }
}



async function getById(req,res){
    try {
        const competition = await CompetitionFormat.findById(req.params.compId).populate(["Course","SelectedQuestions","Registrations"]).lean()
        var paginationObj = paginateArray(req.query.Qpage,competition.SelectedQuestions,13)
        var traverser = paginationObj.ArrayTraverser
        const Questions = competition.SelectedQuestions.slice(traverser.start,traverser.end)
        if(competition == null){
            return {message:"Test(s) Not Found",code:0, };    
        }
        return {message:"Test(s) Found",code:1, data:{"Competition":competition,"Questions":Questions,"QuestionPagination":paginationObj}}; 
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1}
    }    
}


async function editCompetition(req,res){
    try {
        const course = await Course.findById(req.params.id).populate(["Questions","Competitions"]);
        if(course == null){
            return {message:"Course Not Found",code:0}
        }
        if(req.body.SelectedQuestions != ""){
            req.body.SelectedQuestions = JSON.parse(req.body.SelectedQuestions)
        }

            switch (req.body.QuestionSelection) {
                case QuestionSelectionType.AllQuestions:
                if(course.Questions.length < req.body.NumberOfQuestions){
                    return {message:"Not enough Questions ",code:-1}
                }    
                    break;
                case QuestionSelectionType.SelectedQuestions:
                if(req.body.SelectedQuestions < req.body.NumberOfQuestions){
                    return {message:"Not enough Questions ",code:-1}
                }              
                    break;
                default:
                    if(course.Questions.length < req.body.NumberOfQuestions){
                        return {message:"Not enough Questions ",code:-1}
                    }
                    break;
            }
        await CompetitionFormat.findByIdAndUpdate(req.params.compId,req.body,{new:true});
        return {message:"Sent",code:1};
    }catch (err){
        Logger.error(err.message,err)
        return {message:err,code:-1}
    }
}


async function getAttempts(req,res){
    try {
        const attempts = await Attempt.find({"Competition":req.params.id}).populate(["QuestionsAttempted.question"]).lean()
        if(attempts.length == 0){
            return {message:"No Attempts(s) Found",code:1}; 
        }
        return {message:"Attempts(s) Found",code:1, data:attempts }; 
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1}
    } 

}






async function StartRegisterStage(req,res){ 
    try {
    const competition = await CompetitionFormat.findById(req.params.compId);
    competition.Stage = CompetitionStage.Registration
    
    await competition.save()
    return {message:"Competition Set to registration",code:1}; 
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1} 
    }
}

async function StartCompetitionStage(req,res){ 
    try { 
    const competition = await CompetitionFormat.findById(req.params.compId);
    competition.Stage = CompetitionStage.Started

        await competition.save()
        return {message:"Test Opened",code:1};
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1} 
    }
}

async function EndStage(req,res){ 
    try { 
    const competition = await CompetitionFormat.findById(req.params.compId);
        competition.Stage = CompetitionStage.Ended
    
        await competition.save()
        return {message:"Competition Ended",code:1};
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1} 
    }
}

async function deleteCompetition(req,res) {
    try{
    const competition = await CompetitionFormat.findByIdAndDelete(req.params.compId);
    await Attempt.deleteMany({"Competition":req.params.compId})
    return {message:"Test Deleted",code:1,data:competition};
    }catch(err){
    Logger.error(err.message,err)
    return {message:"UnSuccessful",code:-1}
    }
}


////Entry 
async function MakeEntryPayment(req){
    var competition = await CompetitionFormat.findById(req.body.Competition).lean()
    console.log(req.body.FullName)
    const form ={
        "email":req.body.Email,
        "amount":competition.Price * 100 ,
        "metadata":{
            "CompetitionId": req.body.Competition,
            "FullName":req.body.FullName
        }
    }
return form

}

async function AddEntry(response) {
    try {
        console.log(response)
        var entry = new Entry({
            "Email":response.data.customer.email,
            "AmountPaid":(response.data.amount/10),
            "ExamNumber":generateCode(3),
            "FullName":response.data.metadata.FullName,
            "Competition":response.data.metadata.CompetitionId
        })
        var competition = await CompetitionFormat.findById(entry.Competition) 
        if(competition != null){
            await entry.save()
            competition.Registrations.push(entry.id)
            await competition.save()
        }  
        
    } catch (err) {
        Logger.error(err.message,err)
        return {message:"UnSuccessful",code:-1}
    }
}

function generateCode(digits) {  
    var numbers = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < digits; i++ ) { 
        OTP += numbers[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
}



module.exports = {
    getAllCompetition,
    createCompetitionFormat,
    deleteCompetition,
    StartCompetitionStage,
    EndStage,
    StartRegisterStage,
    getById,
    getAttempts,
    MakeEntryPayment,
    AddEntry,
    editCompetition
}
