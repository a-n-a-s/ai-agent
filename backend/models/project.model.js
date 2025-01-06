import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User-AI",
    },
  ],
});

const ProjectModel = mongoose.model("Project", projectSchema);

export default ProjectModel;
