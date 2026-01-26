import About from "../models/about.model.js";
import cloudinary from "../config/cloudinary.js";

// GET ABOUT (Public)
export const getAbout = async (req, res) => {
  const about = await About.findOne();
  res.json(about);
};

// CREATE / UPDATE ABOUT (Admin)
export const upsertAbout = async (req, res) => {
  try {
    const { name, role, bio, socials } = req.body;

    let about = await About.findOne();

    let imageData = {};

    if (req.file) {
      // delete old image if exists
      if (about?.profileImage?.public_id) {
        await cloudinary.uploader.destroy(
          about.profileImage.public_id
        );
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-portfolio/profile",
      });

      imageData = {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    }

    if (about) {
      // UPDATE
      about.name = name;
      about.role = role;
      about.bio = bio;
      about.socials = socials ? JSON.parse(socials) : about.socials;
      if (req.file) about.profileImage = imageData;

      await about.save();
    } else {
      // CREATE
      about = await About.create({
        name,
        role,
        bio,
        socials: socials ? JSON.parse(socials) : {},
        profileImage: imageData,
      });
    }

    res.json({ success: true, about });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
