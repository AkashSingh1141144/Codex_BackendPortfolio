import express from "express";
import { getAbout, upsertAbout } from "../controllers/about.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getAbout); // public
router.put("/", protect, upload.single("image"), upsertAbout); // admin

export default router;
