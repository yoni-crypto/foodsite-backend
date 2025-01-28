import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
// login user
export const loginUser =async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"user doesnt exist"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if (!isMatch){
            return res.json({success:false,message:"Invalid Creditentials"})
        }
        const token =createtoken(user._id)
        res.json({success:true,message:"login successful",token})
    }catch(error){
        console.log(error)
        return res.json({success:false,message:"error"})
    }
}
const createtoken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register user
export const registerUser=async(req,res)=>{
    const {name,password,email}=req.body
    try{
        const exist=await userModel.findOne({email})
        if(exist){
            return res.json({success:false,message:"User already registered"})
        }
        // validating email format and stron password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"password must be greater than 7"})
        }
        // hash
        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(password,salt)

        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedpassword
        })

        const user= await newUser.save()
        const token=createtoken(user._id)
        res.json({success:true,message:"Account created successfully",token})
    }catch(error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
    
}