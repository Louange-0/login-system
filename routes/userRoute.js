import express from "express";
import {renderPasswordResetForm,resetPassword, forgotPassword,login,createUser,register,updateUser,getAllUser,getSingleUser,deleteUser } from "../controllers/userController.js";
import user from "../models/user.js";


const router=express.Router();
router.post('/',createUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
router.get('/:id',getSingleUser)
router.get('/',getAllUser)
router.post('/register',register)
// router.post('/activate/:token',activateAccount)
router.post('/login',login)
// router.post('/activateAccount/:token',activateAccount)
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token',resetPassword)
router.get('/reset-password/:token', renderPasswordResetForm);
export default router;