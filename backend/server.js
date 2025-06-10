import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import fs from "fs/promises";
import supabase from "./db/connectDB.js";
import FileRoutes from "./routes/FileRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";

dotenv.config();

// Variables
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const corsOptions = {
	"origin": "*",
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res)=>{
	res.json({message: "🔥Server is up..."});
});

app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase.from("test_table").select("*").limit(1);
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

// Routes
app.use("/api/file",FileRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);

server.listen(PORT, ()=>{
	console.log(`🔥Server is running at PORT ${PORT}`);
});