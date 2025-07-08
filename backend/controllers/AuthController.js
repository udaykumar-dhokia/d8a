import supabase from "../db/connectDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const AuthController = {
  registerUser: async (req, res) => {
    try {
      const { fullName, email, password } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      // Check if user already exists
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Register new user
      const { data, error } = await supabase.from("users").insert([
        {
          fullName: fullName,
          email,
          password: hashedPassword,
        },
      ]);

      if (error) {
        return res.status(500).json({ message: "Registration failed." });
      }

      return res.status(201).json({ message: "Registered successfully." });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      // Check if user exists
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (!existingUser) {
        return res.status(409).json({ message: "No such user exists." });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign(
        {
          id: existingUser.id,
          email: email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successfully.",
        token: token,
        themeMode: existingUser.themeMode,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  verifyToken: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded) {
        // Fetch user data from database
        const { data: user, error } = await supabase
          .from("users")
          .select("id, fullName, email")
          .eq("email", decoded.email)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
          return res.status(500).json({ message: "Error fetching user data." });
        }

        return res.status(200).json({
          message: true,
          user: {
            fullName: user.fullName,
            email: user.email,
          },
        });
      }
    } catch (err) {
      if (
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError"
      ) {
        return res.status(401).json({ message: false });
      }
    }
    return res.status(500).json({ message: "Internal server error." });
  },

  googleAuth: async (req, res) => {
    try {
      const { access_token } = req.body;
      if (!access_token) {
        return res.status(400).json({ message: "Missing access token." });
      }

      // Fetch user info from Supabase Auth API
      const supabaseUrl = process.env.SUPABASE_URL;
      const { data: userInfo } = await axios.get(
        `${supabaseUrl}/auth/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          },
        }
      );

      const { email, user_metadata } = userInfo;
      const fullName = user_metadata?.full_name || "";

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (!existingUser) {
        const { error } = await supabase.from("users").insert([
          {
            fullName,
            email,
            password: null,
          },
        ]);
        if (error) {
          return res.status(500).json({ message: "Registration failed." });
        }
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        message: "Google login successful.",
        token,
      });
    } catch (err) {
      console.error("Google Auth error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
};

export default AuthController;
