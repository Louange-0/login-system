import mongoose from "mongoose";
 
const teacherSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        unique:true,
        type:String
    },
    salary:{
        type:Number,
        required:true,
    },
    subject:{
        type:String,
        required:true
    }
})
export default mongoose.model("Teacher",teacherSchema);