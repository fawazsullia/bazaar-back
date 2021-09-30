const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

displayName : String,
userType : String,
address : String,
email : String,
uid : String,
cart : [],
orders : []


})

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel