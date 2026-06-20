const express=require("express");
const cors=require("cors");
const UserRoutes=require("./src/routes/userRoutes");
const eventRoutes=require("./src/routes/eventRoutes");
const reservationRoutes=require("./src/routes/reservationRoutes");

require("dotenv").config();

const app=express();

const connectDB=require("./src/config/db");


connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

const PORT= process.env.PORT || 5000;

app.get("/hello",(req,res)=>{
    res.send("Backend running");
});

app.use("/api/user",UserRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/reservations",reservationRoutes)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});