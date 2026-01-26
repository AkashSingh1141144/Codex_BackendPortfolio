import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    profileImage: {
      url: String,
      public_id: String,
    },
    socials: {
      github: String,
      linkedin: String,
      twitter: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("About", aboutSchema);
