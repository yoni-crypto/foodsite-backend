import mongoose from "mongoose";

export const connectDB=async ()=>{
    await mongoose.connect('mongodb+srv://yonidisu111:yoniyoye1.@foodsite.jnhtm3i.mongodb.net/food-hub')
    .then(()=>console.log("DB connected"))
}
