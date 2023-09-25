import express from "express";
import { createStudent,updateStudent,deleteStudent,getSingleStudent,getAllStudent } from "../controllers/studentController.js";

const router=express.Router();
router.post('/',createStudent)
router.put('/:id',updateStudent)
router.delete('/:id',deleteStudent)
router.get('/:id',getSingleStudent)
router.get('/',getAllStudent)


export default router;