import adminModel from "../models/adminModel.js";
import pkg from 'jsonwebtoken';
const { sign: jwtsign } = pkg;
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const admin = await adminModel.findOne({ username });
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwtsign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction, 
            sameSite: isProduction ? "None" : "Lax", 
            path: "/",
          });

        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
            token: token
        });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const adminLogout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: 'Admin logged out successfully',
    });
};  

export const verifyAdmin = (req, res) => {
    const token = req.cookies.token;
    console.log("Verifying admin with token:", token);
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ success: true, adminId: decoded.id });
    } catch (err) {
      res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };