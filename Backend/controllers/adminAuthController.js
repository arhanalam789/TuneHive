import adminModel from "../models/adminModel.js";
import pkg from 'jsonwebtoken';
const { sign: jwtsign } = pkg;
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

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
        res.cookie('token', token);
        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
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