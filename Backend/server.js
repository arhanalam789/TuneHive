import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToMongoDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import adminauthRoutes from "./routes/adminAuthRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://tune-hive-git-main-arhans-projects-fdbbfd81.vercel.app",
  "https://tune-hive-six.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy blocked this origin"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

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
