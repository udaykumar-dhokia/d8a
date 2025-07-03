import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import supabase from "../db/connectDB.js";

dotenv.config();

const OrganisationController = {
  fectMemberOrgs: async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const totalOrgs = [];

    if (!token) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token." });
    }

    try {
      const { data: orgData, error: orgError } = await supabase
        .from("users")
        .select("org_member")
        .eq("email", decoded.email)
        .single();

      if (orgError) {
        return res
          .status(500)
          .json({ error: "Failed to fetch organisations." });
      }

      const orgs = orgData.org_member || [];

      for (const org of orgs) {
        const { data, error } = await supabase
          .from("organisations")
          .select("*")
          .eq("id", org)
          .single();

        totalOrgs.push(data);
      }

      return res.json({ message: totalOrgs });
    } catch (err) {
      if (err.name == "JsonWebTokenError" || err.name == "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid or expired token." });
      }
      return res.status(500).json({ message: "Internal server error." });
    }
  },
  fetchOrgs: async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token." });
    }

    try {
      const { data: orgData, error: orgError } = await supabase
        .from("organisations")
        .select("*")
        .eq("adminEmail", decoded.email);

      if (orgError) {
        return res
          .status(500)
          .json({ error: "Failed to fetch organisations." });
      }
      return res.status(200).json({ message: orgData });
    } catch (err) {
      if (err.name == "JsonWebTokenError" || err.name == "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid or expired token." });
      }
      return res.status(500).json({ message: "Internal server error." });
    }
  },
  createOrg: async (req, res) => {
    const { token, orgName, orgHandle, members = [] } = req.body;

    if (!token || !orgName || !orgHandle) {
      return res.status(401).json({ message: "Missing required fields." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token." });
    }

    const data = {
      orgName: orgName,
      adminEmail: decoded.email,
      orgHandle: orgHandle,
      members: members,
    };

    try {
      const { data: orgData, error: orgError } = await supabase
        .from("organisations")
        .insert([data]);

      if (orgError) {
        return res.status(500).json({ message: "Operation failed." });
      }

      for (const member in members) {
        // Fetch user org data
        const { data: userOrgData, error: userOrgError } = await supabase
          .from("users")
          .select("org_member")
          .eq("email", members[member])
          .single();

        if (userOrgError) {
          return res.status(500).json({ message: "Operation failed." });
        }

        const { data: orgData, error: orgError } = await supabase
          .from("organisations")
          .select("id")
          .eq("orgHandle", orgHandle)
          .single();

        // Update user org data
        const orgs = userOrgData.org_member || [];

        if (!orgs.includes(orgData.id)) {
          orgs.push(orgData.id);

          const { error: updateError } = await supabase
            .from("users")
            .update({ org_member: orgs })
            .eq("email", members[member]);

          if (updateError) {
            return res.status(500).json({ message: "Failed to update user." });
          }
        }
      }

      return res.status(200).json({
        message: "Organisation created successfully.",
        orgData: orgData,
      });
    } catch (err) {
      if (err.name == "JsonWebTokenError" || err.name == "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid or expired token." });
      }
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  checkHandle: async (req, res) => {
    const handle = req.query.handle;

    if (!handle) {
      res.status(400).json({ message: "Missing required fields." });
    }

    try {
      const { data: handleData, error: handleError } = await supabase
        .from("organisations")
        .select("orgHandle")
        .eq("orgHandle", handle)
        .single();

      if (handleData) {
        res.json({ message: true }); // Handle already taken
      } else {
        res.json({ message: false }); // Handle available
      }
    } catch (err) {
      res.status(500).json({ message: "Something went wrong", error: err });
    }
  },

  checkEmail: async (req, res) => {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
      const { data: emailData, error: emailError } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (emailData) {
        return res.json({ message: true }); // Email exists
      } else {
        return res.json({ message: false }); // Email doesn't exists
      }
    } catch (err) {
      res.status(500).json({ message: "Something went wrong", error: err });
    }
  },
};

export default OrganisationController;
