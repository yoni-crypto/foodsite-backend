// import foodModel from "../models/foodModel.js";
// import fs from 'fs'

// // add food item

// export const addFood = async(req,res) => {
//     let image_filename=`${req.file.filename}`

//     const food=new foodModel({
//         name:req.body.name,
//         description:req.body.description,
//         price:req.body.price,
//         category:req.body.category,
//         image:image_filename
//     })
//     try{
//         await food.save()
//         res.json({sucess:true,message:"Food Added"})
//     }catch(error){
//         console.log(error)
//         res.json({sucess:false,message:'error'})
//     }
// }

// // all food list
// export const listFood =async(req,res)=>{
//         try{
//             const foods=await foodModel.find({})
//             res.json({sucess:true,data:foods})
//         }catch(error){
//             console.log(error)
//             res.json({sucess:false,message:false})
//         }
// }

// // remove fooditem

// export const removeFood=async(req,res)=>{
//     try {
//         const food=await foodModel.findById(req.body.id)
//         fs.unlink(`uploads/${food.image}`,()=>{})

//         await foodModel.findByIdAndDelete(req.body.id)
//         res.json({sucess:true,message:"Food Removed"})
//     } catch (error) {
//         console.log(error)
//         res.json({sucess:false,message:"Error"})
//     }
// }
import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add Food Item
export const addFood = async (req, res) => {
    try {
        // Get the Cloudinary upload response
        const { path, filename } = req.file; // `path` is the image URL, `filename` is the unique Cloudinary ID

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: path, // Store Cloudinary URL in the database
            imageId: filename, // Store Cloudinary public ID for deletion
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding food" });
    }
};

// All Food List
export const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving food list" });
    }
};

// Remove Food Item
export const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Remove image from Cloudinary
        if (food.imageId) {
            await cloudinary.uploader.destroy(food.imageId);
        }

        // Remove food item from the database
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error removing food" });
    }
};
