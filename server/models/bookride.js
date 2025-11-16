const mongoose=require('mongoose');
const rideSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    vehicleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Vehicle',
        required:true
    },
    startAddress:{
        type:String,
        required:true
    },
    endAddress:{
        type:String,
        required:true
    },
    fare:{
        type:Number,
        required:true
    },
    totalDistance:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'pending'
    },
    review:{
        type:String,
    },
    rating:{
        type:String
    },
    reviewstatus:{
        type:String
    },
    paymentStatus:{
        type:String
    }
},{timestamps:true});

const riderModel=mongoose.model('ride',rideSchema);

module.exports=riderModel;