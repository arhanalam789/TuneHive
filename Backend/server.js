import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToMongoDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import adminauthRoutes from "./routes/adminAuthRoutes.js";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tune-hive-git-main-arhans-projects-fdbbfd81.vercel.app",
      "https://tune-hive-six.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToMongoDB();

app.use("/api/auth", authRoutes);
app.use("/api/adminauth", adminauthRoutes);

app.get("/", (req, res) => {
  res.send("Hello World from TuneHive Backend 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
