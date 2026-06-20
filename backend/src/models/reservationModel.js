const mongoose=require("mongoose");

const reservationSchema=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",required:true    
        },
        eventId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Event",required:true
        },
        seatNumbers:[{type:Number,required:true}],
        expiresAt:{type:Date,required:true}
    },{
        timestamps:true
    }
);

const Reservation=mongoose.model("Reservation",reservationSchema);

module.exports=Reservation;