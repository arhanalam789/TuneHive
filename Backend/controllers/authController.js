import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import pkg from 'jsonwebtoken';
const { sign: jwtsign } = pkg;
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import axios from 'axios'
dotenv.config();
import jwt from 'jsonwebtoken';
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false, 
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const isProduction = process.env.NODE_ENV === "production";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const token = jwtsign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token)
    ;
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwtsign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? "None" : "Lax", 
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};


export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

  
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "TuneHive", email: process.env.FROM_EMAIL },
        to: [{ email }],
        subject: "Your OTP Code - TuneHive 🎵",
        htmlContent: `
          <h2 style="color:#6C63FF;">TuneHive OTP Verification</h2>
          <p>Your OTP is: <b>${otp}</b></p>
          <p>This code is valid for 5 minutes.</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );


    res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Nodemailer crashed =>", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body; 
    const user = await User.findOne({ email }); 
    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }
    if (user.otp !== otp || user.otpExpiry < new Date()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
};

export const resetpassword = async (req, res) => {
    const { email, newPassword } = req.body; 
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successfully' });
};




export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Authenticating user with token:", token);
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};