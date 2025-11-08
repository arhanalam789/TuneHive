
import mongoose from 'mongoose';

async function connectToMongoDB() {
    const url = process.env.MONGODB_URL;
    if (!url) {
        console.error('MONGODB_URL not set in environment');
        process.exit(1);
    }

    try {
        await mongoose.connect(url); 
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Errorrr connecting to MongoDB:', err);
        throw err;
    }
}

export default connectToMongoDB;