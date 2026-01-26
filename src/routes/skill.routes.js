import express from "express";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getSkills); // public
router.post("/", protect, upload.single("icon"), createSkill);
router.put("/:id", protect, upload.single("icon"), updateSkill);
router.delete("/:id", protect, deleteSkill);

export default router;
