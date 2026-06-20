const mongoose=require("mongoose");
const dns=require("dns");

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGOURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports=connectDB;