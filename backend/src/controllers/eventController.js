const asyncHandler=require("express-async-handler");
const Event=require("../models/eventModel");
const Seat=require("../models/seatModel");

const getAllEvents=asyncHandler(async(req,res)=>{
    const events=await Event.find({}).sort({date:1});

    if(!events){
        res.status(404);
        throw new Error("No events found");
    };
    
    const availableSeats=await Promise.all(
        events.map(async(event)=>{
            const availableSeats=await Seat.countDocuments({
                eventId:event._id,
                status:"available",
            });

            return{
                ...event.toObject(),
                availableSeats,
            };
        })
    );

    res.json(availableSeats);

});

const getEventById=asyncHandler(async(req,res)=>{
    const event=await Event.findById(req.params.id);
    
    if(!event){
        res.status(404);
        throw new Error("Event not found");
    }

    const seats=await Seat.find({eventId:event._id})
    .sort({seatNumber:1});
    res.json({event, seats});
});

module.exports={getAllEvents, getEventById};