import mongoose from 'mongoose';


const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    otp:{type:String},
    otpExpiry:{type:Date}
})

const userModel = mongoose.model('User', userschema);

export default userModel;

