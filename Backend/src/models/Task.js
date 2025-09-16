import mongoose from "mongoose";

const remarkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  minutes: { type: Number, default: 0 },
  status: {
    type: String,
    required: true,
    enum: ["On Hold", "In Progress", "Completed"],
  },
});

const taskSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true },
    project: [{ type: String, required: true }],
    module: [{ type: String, required: true }],

    date: { type: Date, required: true },
    activity_lead: { type: String, required: true },
    team: { type: String, required: true },
    remarks: [remarkSchema],

    // Only employeeId, no userId
    employeeId: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
