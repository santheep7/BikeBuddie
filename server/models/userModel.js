const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   fullname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String},
    verifieddriver:{type:Boolean,default:false},
    verified: {type: Boolean, default: false},
    otp: String,              
    otpExpiration: Date, 
},{timestamps: true});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;