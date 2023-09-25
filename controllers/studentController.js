import Student from "../models/STUDENT.js";

//creating student
export const createStudent=async(req,res)=>{
    const newStudent=new Student(req.body)  
    try{
        const savedStudent=await newStudent.save()
        res.status(200).json({success:true,message:'successfully created', data:savedStudent}) 
    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:'Failed to create. Try again'})
    }
}
//updating student
export const updateStudent=async(req,res)=>{
    const id=req.params.id
    try{
const updatedStudent=await Student.findByIdAndUpdate(id,{
    $set:req.body,
},{new:true})


res.status(200).json({success:true,message:'successfully updated', data:updatedStudent,
});
    }catch(err){
        res.status(500).json
        ({success:false,message:'failed to update'})
    }
};

//deleting student
export const deleteStudent=async(req,res)=>{
    const id=req.params.id
    try{
await Student.findByIdAndDelete(id)


res.status(200).json({success:true,message:'successfully deleted'
});
    }catch(err){
        res.status(500).json
        ({success:false,message:'failed to delete'})
    }
};

//get one student
export const getSingleStudent=async(req,res)=>{
    const id=req.params.id
    try{
const student=await Student.findById(id)


res.status(200).json({success:true,message:'successful',
data:student
});
    }catch(err){
        res.status(404).json
        ({success:false,message:'not found'})
    }
};
//get all students 
export const getAllStudent=async(req,res)=>{
    try{
const student=await Student.find({})
res.status(200).json({success:true,message:'successful',
data:student})
    }catch(err){
        res.status(404).json
        ({success:false,message:'not found'})  
    }
};