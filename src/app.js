import express from "express";
import cors from "cors";

const app = express();

// middlewares
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true, // allow cookies / auth headers
}));
app.use(express.json());


// routes
import testRoutes from "./routes/test.routes.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import projectRoutes from "./routes/project.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import skillRoutes from "./routes/skill.routes.js";


app.use("/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);



// test route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running 🚀",
  });
});

export default app;
