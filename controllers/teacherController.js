import Teacher from "../models/TEACHER.js";

//creating student
export const createTeacher=async(req,res)=>{
    const newTeacher=new Student(req.body)
    try{
        const savedTeacher=await newTeacher.save()
        res.status(200).json({success:true,message:'successfully created', data:savedTeacher}) 
    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:'Failed to create. Try again'})
    }
}
//updating student
export const updateTeacher = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({ success: true, message: 'successfully updated', data: updatedTeacher });
    } catch (error) {
        console.error(error); // Move the console.log statement here
        res.status(500).json({ success: false, message: 'failed to update' });
    }
};


//deleting student
export const deleteTeacher=async(req,res)=>{
    const id=req.params.id
    try{
await Teacher.findByIdAndDelete(id)


res.status(200).json({success:true,message:'successfully deleted'
});
    }catch(err){
        res.status(500).json
        ({success:false,message:'failed to delete'})
    }
};

//get one student
export const getSingleTeacher=async(req,res)=>{
    const id=req.params.id
    try{
const teacher=await Teacher.findById(id)


res.status(200).json({success:true,message:'successful',
data:teacher
});
    }catch(err){
        res.status(404).json
        ({success:false,message:'not found'})
    }
};
//get all students 
export const getAllTeacher=async(req,res)=>{
    try{
const teacher=await Teacher.find({})
res.status(200).json({success:true,message:'successful',
data:teacher})
    }catch(err){
        res.status(404).json
        ({success:false,message:'not found'})  
    }
};