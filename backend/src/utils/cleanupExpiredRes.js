const User=require("../models/userModel");
const Seat=require("../models/seatModel");
const Reservation=require("../models/reservationModel");
const asyncHandler=require("express-async-handler");

const cleanupExpiredReservations=asyncHandler(async()=>{
    const expiredReservations = await Reservation.find({
        expiresAt: { $lt: new Date() },
        });

    for (const reservation of expiredReservations) {
    // Release reserved seats
        await Seat.updateMany(
            {
                eventId: reservation.eventId,
                seatNumber: { $in: reservation.seatNumbers },
                status: "reserved",
          },
        {
            $set: {
            status: "available",
        },
      }
    );

    // Delete reservation
    await Reservation.deleteOne({
      _id: reservation._id,
    });
  }
});

module.exports=cleanupExpiredReservations;
