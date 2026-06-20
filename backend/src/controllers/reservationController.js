const asynchandler=require("express-async-handler");
const Reservation=require("../models/reservationModel");
const User=require("../models/userModel");
const Event=require("../models/eventModel");
const Seat=require("../models/seatModel");
const mongoose=require("mongoose");
const cleanupExpiredReservations=require("../utils/cleanupExpiredRes");

const createReservation=asynchandler(async(req,res)=>{
    const {eventId, seatNumbers}=req.body;
    const userId=req.user._id; 
    
    if(!eventId || seatNumbers.length===0 || !Array.isArray(seatNumbers)){
        res.status(400);
        throw new Error("Please provide eventId and seatNumbers");
    }

    await cleanupExpiredReservations();

    const session=await mongoose.startSession();

    try{
        session.startTransaction();

        const result=await Seat.updateMany(
            {
                eventId,
                seatNumber:{$in:seatNumbers},
                status:"available",
            },
            {
                $set:{
                    status:"reserved",
                },
            },
            {session}
        );

        if(result.modifiedCount!==seatNumbers.length){
                throw new Error("Some seats are already reserved/booked");
        }

        const expiresAt=new Date(Date.now()+10*60*1000);

        const reservation=await Reservation.create(
            [{
                userId,
                eventId,
                seatNumbers,
                expiresAt
            }],
            {session}
        );

        await session.commitTransaction();
        res.status(201).json({
            message:"Seats reserved successfully",
            reservationId:reservation[0]._id,
            expiresAt
        });
    }catch(error){
        await session.abortTransaction();
        res.status(400);
        throw new Error(error.message);
    }

});

const confirmbooking=asynchandler(async(req,res)=>{
    const {reservationId}=req.body;
    const userId=req.user._id;

    if(!reservationId){
        res.status(400);
        throw new Error("Please provide reservationId");
    }
    
    await cleanupExpiredReservations();
    
    const session=await mongoose.startSession();

    try{
        session.startTransaction();

        const reservation=await Reservation.findOne({
            _id:reservationId,
            userId
        }).session(session);

        if(!reservation){
            throw new Error("Reservation not found");
        }

        if(reservation.expiresAt<new Date()){
            throw new Error("Reservation has expired");
        }

        const result=await Seat.updateMany(
            {
                eventId:reservation.eventId,
                seatNumber:{$in:reservation.seatNumbers},
                status:"reserved",
            },{
                $set:{
                    status:"booked",
                },
            },
            {session}
        );
        
        await Reservation.deleteOne({
            _id:reservationId,
            userId
        },{session});

        await session.commitTransaction();

        res.json({
            message:"Booking confirmed succesffully, enjoy the event!",
            bookedSeats:reservation.seatNumbers
        })
        
    }catch(error){
        await session.abortTransaction();
        res.status(400);
        throw new Error(error.message);
    }

});

module.exports={createReservation,confirmbooking};