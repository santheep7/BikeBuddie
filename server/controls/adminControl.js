const userModel=require('../models/userModel');
const vehicleModel=require('../models/bikemodel')
const riderModel=require('../models/bookride')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const contact=require('../models/contact')
const viewUsers=async(req,res)=>{
    try{
        const users=await userModel.find({role:'user'});
        res.status(200).json(users);
    }catch(error){
        res.status(404).json(error.message);
    }
}


const viewRiders = async (req, res) => {
    try {
        console.log("view")
        const riders = await vehicleModel.find({}).populate("userId"); 
        res.status(200).json(riders);
        console.log(riders)
        res.end()
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const verifyRider=async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    try{
        await userModel.findByIdAndUpdate(id,{verifieddriver:true});
        res.status(200).json('Rider verified successfully');    
    }catch(error){
        res.status(404).json(error.message);
    }
}

const deleteUser=async(req,res)=>{
    const id=req.params.id;
    try{
        await userModel.findByIdAndDelete(id);
        res.status(200).json('User deleted successfully');
    }catch(error){
        res.status(404).json(error.message);
    }
}


const countDetails = async (req, res) => {
    try {
        const userCount = await userModel.countDocuments({ role: "user" });
        const riderCount = await userModel.countDocuments({ role: "rider" });
        const bikeCount = await vehicleModel.countDocuments();
        const bookCount= await riderModel.countDocuments();
        res.json({ users: userCount, riders: riderCount, bikes: bikeCount ,bookings : bookCount});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const viewRides=async(req,res)=>{
    try{
        const rides=await riderModel.find().populate("userId")
        res.json(rides)
    }catch(err){
        res.status(500).json({ message: "Server error", error });
    }
}


const viewReviews=async(req,res)=>{
    try{
        const reviews=await riderModel.find().populate("userId").populate("vehicleId")
        res.json(reviews)
    }catch(err){
        res.status(500).json({ message: "Server error", error });
    }
}

const update=async(req,res)=>{
    try{
        const id=req.headers.id
        console.log(id)
        await riderModel.findByIdAndUpdate({_id:id},{reviewstatus:"posted"})
        res.json("Posted Successfully")
    }catch(err){
        res.status(500).json({ message: "Server error", err });
    }
}

const fetchMessage = async (req, res) => {
    try {
        const messages = await contact.find({});
        console.log("Messages:", messages);
        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

module.exports={viewUsers,viewRiders,verifyRider,deleteUser,countDetails,viewRides,viewReviews,update,fetchMessage};