import Project from "../models/project.model.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    // console.log("=== DEBUG START ===");
    console.log("REQ BODY:", req.body);   // form fields
    console.log("REQ FILE:", req.file);   // uploaded file object

    const { title, description, techStack, githubLink, liveLink } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and Description required" });
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
    } else {
      console.log("No file received in req.file");
    }

    const project = await Project.create({
      title,
      description,
      techStack: techStack?.split(","),
      githubLink,
      liveLink,
      image: imageData,
    });

    console.log("Project created:", project);
    // console.log("=== DEBUG END ===");

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error("ERROR IN CREATE PROJECT:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROJECTS (Public)
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

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // agar nayi image aayi
    if (req.file) {
      console.log("Replacing image...");

      // old image delete
      if (project.image?.public_id) {
        await cloudinary.uploader.destroy(project.image.public_id);
      }

      // new image upload
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-portfolio/projects",
      });

      project.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // text fields update
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.techStack = req.body.techStack
      ? req.body.techStack.split(",")
      : project.techStack;
    project.githubLink = req.body.githubLink || project.githubLink;
    project.liveLink = req.body.liveLink || project.liveLink;

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
      console.log("Deleting image from Cloudinary:", project.image.public_id);
      await cloudinary.uploader.destroy(project.image.public_id);
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("ERROR IN DELETE PROJECT:", error);
    res.status(500).json({ message: error.message });
  }
};
