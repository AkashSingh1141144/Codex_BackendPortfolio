import express from "express";
import Admin from "../models/admin.model.js";

const router = express.Router();

router.get("/create-admin", async (req, res) => {
  const admin = await Admin.create({
    name: "Akash",
    email: "akash@test.com",
    password: "password123",
  });

  res.json(admin);
});

export default router;
