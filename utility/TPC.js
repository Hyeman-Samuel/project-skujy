const Mongoose=require('mongoose');

const Fawn = require("fawn")
Fawn.init(Mongoose)

module.exports = Fawn