const mongoose=require("mongoose");

const eventModel=new mongoose.Schema(
    {
       eventName:{type:String,required:true},
       dateTime: {type:Date,required:true},
       venue:{type:String,required:true},
       totalSeats:{type:Number,required:true},
    },{
        timestamps:true,
    }
);

const Event=mongoose.model("Event",eventModel);

module.exports=Event;