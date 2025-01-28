import orderModel from "../models/ordermodel.js";
import userModel from "../models/userModel.js";

import Stripe from "stripe"

// const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)
const stripe=new Stripe('sk_test_51PIrHERoZMEKlFEwvvZBJZuOce68kMWaLpjOzPnghztB4hrVfVuBLxyygOT4NIvjcU7eBY14nYApfYtyWasQVvQ500iwG3kiJI')


// place user order
export const placeOrder = async (req,res)=>{

    const frontend_url="http://localhost:3001"

    try {
        const newOrder=new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save()
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

        const line_items=req.body.items.map((item)=>({
            price_data:{
                currency:"ETB",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))
        line_items.push({
            price_data:{
                currency:"ETB",
                product_data:{
                    name:"delivery charges"
                },
                unit_amount:2*100*50
            },
            quantity:1
        })
        const session =await stripe.checkout.sessions.create({ // corrected here
            // payment_method_types: ['card'],
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        res.json({success:true,session_url:session.url})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:'Error'})
    }

    
}

export const verifyOrder =async(req,res)=>{
        const {orderId,success}=req.body
        try {
            if(success=="true"){
                await orderModel.findByIdAndUpdate(orderId,{payment:true})
                res.json({success:true,message:"Paid"})
            }else{
                await orderModel.findByIdAndDelete(orderId)
                res.json({success:false,message:"Not Paid"})
            }
        } catch (error) {
            console.log(error)
            res.json({success:false,message:"Error"})
        }
    }

export const userOrders=async(req,res)=>{
    try {
        const orders=await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"error"})
    }
}

// listing order for admin
export const listOrders=async (req,res)=>{
    try {
        const orders=await orderModel.find({})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
} 
// api for updating order status
export const updateStatus=async(req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}
export const deleteOrder = async(req, res) => {
    try {
        await orderModel.findByIdAndDelete(req.body.orderId)
        res.json({success: true, message: "Order deleted successfully"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error in deleting order"})
    }
}

