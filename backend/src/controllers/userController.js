const asyncHandler=require("express-async-handler")
const User=require("../models/userModel")
const validator=require("validator");
const generateToken=require("../config/generateToken");

const registerUser=asyncHandler(async(req,res)=>{
    const {email,name,password}=req.body;

    if(!email || !name || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    if(!validator.isEmail(email)){
        res.status(400);
        throw new Error("Please enter a valid email");
    }else if(!validator.isStrongPassword(password)){
        res.status(400);
        throw new Error("Password is not strong enough.");
    }

    const userExists=await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const user=await User.create({
        name,
        email,
        password
    });

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        });
    }else{
        res.status(400);
        throw new Error("Failed to register user");
    }
});

const LoginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    
    const user=await User.findOne({email});

    if (user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        });
    }else{
        res.status(401);
        throw new Error("Invalid Login Credentials");
    }
});

module.exports={registerUser,LoginUser};