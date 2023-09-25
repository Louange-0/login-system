import mongoose from "mongoose";
 
const userSchema = new mongoose.Schema({
    username:{
        unique:true,
        required:true,
        type:String
    },
    email:{
        required:true,
        unique:true,
        type:String
    },
   password:{
    type:String,
    required:true
   },
   confirmpassword:{
    type:String,
    required:true

   },
   resetToken: String, 
   resetTokenExpiration: Date,
})
export default mongoose.model("User",userSchema);