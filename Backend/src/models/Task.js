import mongoose from "mongoose";

const remarkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  hours: { type: Number, default: 0 },
  minutes: { type: Number, default: 0 },
});

const taskSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  project: [{ type: String, required: true }],
  module: [{ type: String, required: true }],
  status: { type: String, required: true, enum: ["Pending", "In Progress", "Completed"] },
  date: { type: Date, required: true },
  activity_lead: { type: String, required: true },
  team: { type: String, required: true },
  remarks: [remarkSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);