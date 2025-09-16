import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    projectName: { type: String, required: true },
    client: { type: String, required: true },
    projectLead: {
      type: String,
      required: true,
      enum: ["Subodh Sir", "Aditya Sir", "Yogendra Sir", "Atul Sir"],
    },
    category: { type: String, required: true },
    modules: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
