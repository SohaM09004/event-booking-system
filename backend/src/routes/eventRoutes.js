const express=require("express");
const router=express.Router();
const {getAllEvents,getEventById}=require("../controllers/eventController");
const {protect}=require("../middleware/authMiddleware");

router.route("/").get(protect,getAllEvents);
router.route("/:id").get(protect,getEventById);

module.exports=router;