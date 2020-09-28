var cloudinary = require('cloudinary').v2;
const config= require("config");
const {Logger} = require("./Logger")
try {
  cloudinary.config({ 
  cloud_name: config.get("CloudName"), 
  api_key:config.get("ApiKey"), 
  api_secret: config.get("ApiSecret")
});
} catch (ex) {
  Logger.error(ex.message,ex)
}





module.exports = cloudinary