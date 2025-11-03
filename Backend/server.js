import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToMongoDB from './config/MongoDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));
app.use(cookieParser());
connectToMongoDB();

app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
