import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import supabase from "../db/connectDB.js";

dotenv.config();

const UserController = {
  getData: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res.status(500).json({ message: "Internal server error." });
      }

      const { email } = decoded;

      if (!email) {
        return res.status(400).json({ message: "Email not found in token." });
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        return res.status(404).json({ message: "User not found.", error });
      }

      return res.status(200).json({ message: data });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired." });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token." });
      } else {
        return res.status(500).json({ message: "Internal server error." });
      }
    }
  },

  getTheme: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res.status(500).json({ message: "Internal server error." });
      }

      const { email } = decoded;

      if (!email) {
        return res.status(400).json({ message: "Email not found in token." });
      }

      const { data, error } = await supabase
        .from("users")
        .select("themeMode")
        .eq("email", email)
        .single();

      if (error) {
        return res.status(404).json({ message: "User not found.", error });
      }

      return res.status(200).json({ themeMode: data.themeMode });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired." });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token." });
      } else {
        return res.status(500).json({ message: "Internal server error." });
      }
    }
  },

  updateTheme: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { themeMode } = req.body;

      if (!token) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      if (typeof themeMode !== "boolean") {
        return res.status(400).json({ message: "Invalid theme mode." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res.status(500).json({ message: "Internal server error." });
      }

      const { email } = decoded;

      if (!email) {
        return res.status(400).json({ message: "Email not found in token." });
      }

      const { error } = await supabase
        .from("users")
        .update({ themeMode })
        .eq("email", email);

      if (error) {
        return res
          .status(500)
          .json({ message: "Failed to update theme.", error });
      }

      return res.status(200).json({ message: "Theme updated successfully." });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired." });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token." });
      } else {
        return res.status(500).json({ message: "Internal server error." });
      }
    }
  },
};

export default UserController;
