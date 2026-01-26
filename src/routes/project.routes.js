import express from "express";
import {
  createProject,
  getProjects,
  deleteProject,
} from "../controllers/project.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { updateProject } from "../controllers/project.controller.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", protect, upload.single("image"), createProject);
router.delete("/:id", protect, deleteProject);
router.put("/:id",protect, upload.single("image"), updateProject); // yaha pr maine protect middleware add kiya hai

export default router;
