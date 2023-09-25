import express from "express";
import { createTeacher,updateTeacher,deleteTeacher,getSingleTeacher,getAllTeacher } from "../controllers/teacherController.js";

const router=express.Router();
router.post('/',createTeacher)
router.put('/:id',updateTeacher)
router.delete('/:id',deleteTeacher)
router.get('/:id',getSingleTeacher)
router.get('/',getAllTeacher)

export default router;