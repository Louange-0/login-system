import mongoose from "mongoose";
 
const studentSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        unique:true,
        type:String
    },
    studId:{
        type:Number,
        required:true,
        unique:true
    }
})
export default mongoose.model("Student",studentSchema);