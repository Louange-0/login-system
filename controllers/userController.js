import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import nodemailer from 'nodemailer'
import cryptoRandomString from 'crypto-random-string';
import { fileURLToPath } from 'url'; // Import the 'fileURLToPath' function
import path from 'path';
import { dirname } from 'path';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname=dirname(__filename)

// Create a new user (Register)
export const register = async (req, res) => {
    const { username, email, password, confirmpassword } = req.body;

    try {
        if (!username || !email || !password || !confirmpassword) {
            return res.status(400).json({ success: false, message: 'Empty input fields!' });
        }

        if (!/^[a-zA-Z]*$/.test(username)) {
            return res.status(400).json({ success: false, message: 'Invalid name entered' });
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email' });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ success: false, message: 'Password not matching' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword,
        });

        await newUser.save();

        return res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred while registering the user' });
    }
};
export const createUser = async (req, res) => {
    const newUser = new User(req.body);
    try {
        const savedUser = await newUser.save();
        res.status(200).json({ success: true, message: 'Successfully created', data: savedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Failed to create. Try again' });
    }
}

// Update a user
export const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({ success: true, message: 'Successfully updated', data: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update' });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Successfully deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete' });
    }
};

// Get a single user
export const getSingleUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        res.status(200).json({ success: true, message: 'Successful', data: user });
    } catch (err) {
        res.status(404).json({ success: false, message: 'Not found' });
    }
};

// Get all users
export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, message: 'Successful', data: users });
    } catch (err) {
        res.status(404).json({ success: false, message: 'Not found' });
    }
};

// Login
export const login = async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({ status: "FAILED", message: "Empty input fields!" });
        return;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({ status: "FAILED", message: "Invalid email" });
        return;
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.json({ status: "FAILED", message: "User not found" });
        } else {
            const hashedPassword = user.password;
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (passwordMatch) {
                // Generate JWT token
                const payload = {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                };
                const secretKey = process.env.SECRET_KEY;
                const expiresIn = '1h';
                const token = jwt.sign(payload, secretKey, { expiresIn });

                res.json({ status: "SUCCESS", message: "Login successful", data: { token, ...payload } });
            } else {
                res.json({ status: "FAILED", message: "Incorrect password" });
            }
        }
    } catch (err) {
        console.log(err);
        res.json({ status: "FAILED", message: "An error occurred while searching for existing users" });
    }
}
// controllers/userController.js

// Function to handle the "Forgot Password" action
// Function to handle the "Forgot Password" action
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        console.log('received email:',email)
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate the reset token and wait for it to complete
        const resetToken = await generateResetToken(user._id);

        // Send a reset email with the token to the user's email address
        sendResetEmail(user.email, resetToken);

        return res.json({ success: true, message: 'Reset email sent. Check your inbox.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};
async function generateResetToken(userId) {
    try {
        const resetToken = cryptoRandomString({ length: 32 });
        const resetTokenExpiration = new Date(Date.now() + 3600000); // Token expiration time (1 hour)

        // Update the user document with the reset token and expiration time
        const user = await User.findByIdAndUpdate(userId, {
            resetToken: resetToken,
            resetTokenExpiration: resetTokenExpiration,
        });

        if (!user) {
            throw new Error('User not found'); 
        }

        return resetToken;
    } catch (error) {
        console.error('Error generating reset token:', error);
        throw error; 
    }
}

function sendResetEmail(email, resetToken) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'mbabazilouangeliza@gmail.com',
            pass: 'thptgwaajzhnbmpd'
        },
    });

    
    const mailOptions = {
        from: 'noreply@hello.com', 
        to: email, 
        subject: 'Password Reset Request', 
        html: `<p>Click the following link to reset your password:</p>
               <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset Password</a>`, // Reset link with the token
    };

    //
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending reset email:', error);
            res.json({ status: "FAILED", message: "An error occurred" });
        } else {
            console.log('Reset email sent:', info.response);
            res.json({ status: "FAILED", message: "Email sent" });
        }
    });
}



export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmnewpassword } = req.query; // Changed to req.query

    try {
        const user = await User.findOne({ resetToken: token });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid or expired token' });
        }

        // Check if the reset token is still valid
        if (user.resetTokenExpiration < new Date()) {
            return res.status(400).json({ success: false, message: 'Token has expired' });
        } else if (confirmnewpassword !== newPassword) {
            return res.status(400).json({ success: false, message: 'Passwords are not matching' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds); // Provide the new password and salt

        // Update user's password with the new hashed password
        user.password = hashedPassword;
        user.confirmpassword = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;

        await user.save();
        // return res.redirect('/login.html');

        return res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};
export const renderPasswordResetForm = async (req, res) => {
    const { token } = req.params;

    try {
        // Check if the token exists and is not expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: new Date() }, // Check if the token is not expired
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid or expired token' });
        }
        // Render the password reset form, passing the token as a parameter
        // You can use a template engine like EJS or send an HTML file
        res.sendFile(path.join(__dirname, '../public', 'resetpassword.html'));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};
export default router;
