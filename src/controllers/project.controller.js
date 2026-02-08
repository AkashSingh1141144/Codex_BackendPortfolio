import Project from "../models/project.model.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    let { title, description, techStack, category, githubLink, liveLink } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and Description required" });
    }

    // 🔹 FormData parsing fix
    if (techStack && typeof techStack === "string") {
      try {
        techStack = JSON.parse(techStack);
      } catch {
        techStack = techStack.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    if (category && typeof category === "string") {
      try {
        category = JSON.parse(category);
      } catch {
        category = category.trim().toLowerCase();
      }
    }

    let imageData = {};
    if (req.file) {
      console.log("Uploading file to Cloudinary...");
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-portfolio/projects",
      });
      console.log("Cloudinary Upload Result:", upload);

      imageData = {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    }

    const project = await Project.create({
      title,
      description,
      techStack: techStack || [],
      category: category || "uncategorized",
      githubLink,
      liveLink,
      image: imageData,
    });

    console.log("Project created:", project);
    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error("ERROR IN CREATE PROJECT:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("ERROR IN GET PROJECTS:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (req.file) {
      if (project.image?.public_id) {
        await cloudinary.uploader.destroy(project.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-portfolio/projects",
      });

      project.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    let { title, description, techStack, category, githubLink, liveLink } = req.body;

    if (techStack && typeof techStack === "string") {
      try {
        techStack = JSON.parse(techStack);
      } catch {
        techStack = techStack.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    if (category && typeof category === "string") {
      try {
        category = JSON.parse(category);
      } catch {
        category = category.trim().toLowerCase();
      }
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.techStack = techStack || project.techStack;
    project.category = category || project.category;
    project.githubLink = githubLink || project.githubLink;
    project.liveLink = liveLink || project.liveLink;

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.image?.public_id) {
      await cloudinary.uploader.destroy(project.image.public_id);
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("ERROR IN DELETE PROJECT:", error);
    res.status(500).json({ message: error.message });
  }
};
