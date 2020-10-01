const nodemailer = require('nodemailer');
const handlebars= require("handlebars");
const fs = require("fs");
const config= require("config");
const {Logger} = require("./Logger")

async function SendHbsEmail(HbsFilePath,HbsData,receiverMail,subject){
fs.readFile(HbsFilePath,(error,data)=>{
    if(error){
        Logger.error("Could not find Hbs file",error)
        return
    }
    var Handlebarsfile= handlebars.compile(data.toString())
    var handlebarsGeneratedHtml=Handlebarsfile({HbsData});
    SendMail(receiverMail,handlebarsGeneratedHtml,subject);
});
}

async function SendTextEmail (receiverMail,text,subject)
{
const AdminMail=""//config.get("MailerEmail")
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: AdminMail ,
        pass:""//config.get("MailerPassword")
    }
    });

    let mailOptions = {
        from: AdminMail,
        to: receiverMail,
        subject: subject,
        html: text
        };

    transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
            Logger.error("Email failed to send",error)
            return
            }
            Logger.info("Email Sent",response)
            });
        
}
var Mailer = {SendTextEmail,SendHbsEmail}

module.exports = Mailer