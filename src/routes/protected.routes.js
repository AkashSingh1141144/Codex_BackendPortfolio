import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.json(req.admin);
});

export default router;
