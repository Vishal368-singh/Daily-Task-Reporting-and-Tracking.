// models/Task.js
import mongoose from "mongoose";

const remarkSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxlength: 200 },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "On Hold", "Completed"],
      default: "Pending",
    },
    minutes: { type: Number, default: 0, min: 0 },
    workDate: { type: Date, default: Date.now },
    totalRemarkDuration: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true },
    employeeId: { type: String, required: true, index: true },
    team: { type: String, required: true },
    project: { type: String, required: true },
    module: { type: [String], required: true },
    activity_lead: { type: String, required: true },
    date: { type: Date, required: true },

    // derived from remarks (latest remark)
    status: {
      type: String,
      enum: ["Pending", "In Progress", "On Hold", "Completed"],
      default: "Pending",
    },

    remarks: { type: [remarkSchema], default: [] },

    // visible = true if ANY remark has status Pending
    visible: { type: Boolean, default: true },

    completedAt: { type: Date },
    totalTimeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// pre-save: recalc totalTimeSpent and visible and status = latest remark
taskSchema.pre("save", function (next) {
  if (this.remarks && this.remarks.length) {
    this.totalTimeSpent = this.remarks.reduce(
      (s, r) => s + (r.minutes || 0),
      0
    );

    // Calculate cumulative totalRemarkDuration for each remark
    let cumulative = 0;
    this.remarks.forEach((r) => {
      cumulative += r.minutes || 0;
      r.totalRemarkDuration = cumulative;
    });
  
    

    // Visible if any remark is not completed
    this.visible = this.remarks.some((r) => r.status !== "Completed");

    // Task status overall
    const allCompleted = this.remarks.every((r) => r.status === "Completed");
    if (allCompleted) {
      this.status = "Completed";
      this.completedAt = this.completedAt || new Date();
    } else if (this.remarks.some((r) => r.status === "In Progress")) {
      this.status = "In Progress";
    } else if (this.remarks.some((r) => r.status === "On Hold")) {
      this.status = "On Hold";
    } else {
      this.status = "Pending";
    }
  } else {
    this.totalTimeSpent = 0;
    this.visible = true;
    this.status = "Pending";
  }

  next();
});

taskSchema.index({ employeeId: 1, date: 1 });
taskSchema.index({ "remarks.status": 1 });

export default mongoose.model("Task", taskSchema);
