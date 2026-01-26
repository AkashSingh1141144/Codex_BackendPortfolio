import Skill from "../models/skillSchema.model.js";
import cloudinary from "../config/cloudinary.js";

// GET ALL SKILLS (Public)
export const getSkills = async (req, res) => {
  const skills = await Skill.find().sort({ createdAt: -1 });
  res.json(skills);
};

// CREATE SKILL (Admin)
export const createSkill = async (req, res) => {
  try {
    const { title, category, level } = req.body;

    let iconData = {};

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-portfolio/skills",
      });

      iconData = {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    }

    const skill = await Skill.create({
      title,
      category,
      level,
      icon: iconData,
    });

    res.status(201).json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SKILL (Admin)
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    const { title, category, level } = req.body;

    if (req.file) {
      // delete old icon
      if (skill.icon?.public_id) {
        await cloudinary.uploader.destroy(skill.icon.public_id);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-portfolio/skills",
      });

      skill.icon = {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    }

    skill.title = title || skill.title;
    skill.category = category || skill.category;
    skill.level = level || skill.level;

    await skill.save();

    res.json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE SKILL (Admin)
export const deleteSkill = async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return res.status(404).json({ message: "Skill not found" });

  if (skill.icon?.public_id) {
    await cloudinary.uploader.destroy(skill.icon.public_id);
  }

  await skill.deleteOne();
  res.json({ success: true, message: "Skill deleted" });
};
