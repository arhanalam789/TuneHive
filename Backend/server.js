import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToMongoDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://tune-hive-git-main-arhans-projects-fdbbfd81.vercel.app"
];

app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://tune-hive-git-main-arhans-projects-fdbbfd81.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToMongoDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World from TuneHive Backend 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
