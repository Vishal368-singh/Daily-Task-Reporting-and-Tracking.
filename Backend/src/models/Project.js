import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    project_id: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    client: { type: String, required: true },
    projectLead: {
      type: String,
      required: true,
      enum: ["Aditya Sareen", "Dr Atul Kapoor", "Subodh Kumar"],
    },
    category: { type: String, required: true },
    modules: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
