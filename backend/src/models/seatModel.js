const mongoose=require("mongoose");

const seatSchema=new mongoose.Schema(
    {
        eventId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Event", required:true
        },
        seatNumber:{type:Number,required:true},
        status:{type:String,enum:["available","reserved","booked"],default:"available"}
    },{
        timestamps:true,
    }
);

seatSchema.index({eventId:1, seatNumber:1}, {unique:true});

const Seat=mongoose.model("Seat",seatSchema);

module.exports=Seat;