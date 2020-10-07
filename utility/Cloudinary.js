var cloudinary = require("cloudinary").v2;
const config = require("config");

// cloudinary.config({
//   cloud_name: config.get("CloudName"),
//   api_key:config.get("ApiKey"),
//   api_secret: config.get("ApiSecret")
// });

module.exports = cloudinary;
