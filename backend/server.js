import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import fs from "fs/promises";
import supabase from "./db/connectDB.js";
import FileRoutes from "./routes/FileRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import AnalyseRoutes from "./routes/AnalyseRoutes.js";

dotenv.config();

// Variables
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://d8a.onrender.com",
  "https://d8a.vercel.app/",
  "https://d8a.vercel.app/dashboard",
  "https://d8a.vercel.app/files",
  "https://d8a.vercel.app/analyse",
  "https://d8a.vercel.app/settings",
  "https://d8a.vercel.app/login",
  "https://d8a.vercel.app/register",
];

// Configure CORS with origin check
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "🔥Server is up..." });
});

// Supabase test route
app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("test_table")
      .select("*")
      .limit(1);
    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }
    res.json({
      message: "Supabase client is working",
      data: data || "No data returned (table may be empty)",
    });
  } catch (error) {
    console.error("Supabase test error:", error);
    res.status(500).json({
      message: "Supabase client error",
      error: error.message,
    });
  }
});

// API routes
app.use("/api/file", FileRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/analyse", AnalyseRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`🔥 Server is running at PORT ${PORT}`);
});
