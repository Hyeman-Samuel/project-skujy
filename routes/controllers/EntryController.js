const {Entry} = require("../../models/Entry") 



async function getEntryById(req){
    try {
const entry =  await Entry.findById(req.params.entryId).lean()
if(entry == null){
    return {message:"Not found",code:-1,data:entry}
}
return {message:"Successful",code:1,data:entry}
    } catch (error) {
return {message:error,code:-1}
    }

}


module.exports={ 
    getEntryById
}
