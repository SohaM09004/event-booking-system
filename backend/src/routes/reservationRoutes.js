const express = require("express");
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");
const {createReservation,confirmbooking}=require("../controllers/reservationController");

router.route("/").post(protect,createReservation);
router.route("/bookings").post(protect,confirmbooking);

module.exports=router;