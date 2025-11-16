const mongoose=require('mongoose');

const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.mongoserver);
        console.log('Database connected');
    }catch(err){
        console.log(err);
    }
}

module.exports=dbConnect;
