import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Tools", "Other"],
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    icon: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
