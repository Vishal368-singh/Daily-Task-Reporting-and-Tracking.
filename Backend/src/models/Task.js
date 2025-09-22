// models/Task.js
import mongoose from "mongoose";

const remarkSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxlength: 200 },

    // live status
    status: {
      type: String,
      enum: ["In Progress", "On Hold", "Completed"],
      default: "In Progress",
    },

    // historical (won’t flip back after completion/on hold)
    finalStatus: {
      type: String,
      enum: ["In Progress", "On Hold", "Completed"],
      default: "In Progress",
    },

    minutes: { type: Number, default: 0, min: 0 },
    totalRemarkDuration: { type: Number, default: 0, min: 0 },
    workDate: { type: Date, default: Date.now },

    // status transition timestamps
    completedAt: { type: Date },
    onHoldAt: { type: Date },
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  },
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

    // task-level live status
    status: {
      type: String,
      enum: ["Pending", "In Progress", "On Hold", "Completed"],
      default: "Pending",
    },

    // task-level historical lifecycle status
    finalStatus: {
      type: String,
      enum: ["Pending", "In Progress", "On Hold", "Completed"],
      default: "Pending",
    },

    remarks: { type: [remarkSchema], default: [] },

    // task-level lifecycle timestamps
    completedAt: { type: Date },
    onHoldAt: { type: Date },

    totalTimeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Pre-save hook: recalc durations + task status
taskSchema.pre("save", function (next) {
  if (this.remarks && this.remarks.length) {
    // total time
    this.totalTimeSpent = this.remarks.reduce(
      (s, r) => s + (r.minutes || 0),
      0
    );

    // cumulative duration + remark lifecycle updates
    let cumulative = 0;
    this.remarks.forEach((r) => {
      cumulative += r.minutes || 0;
      r.totalRemarkDuration = cumulative;

      if (r.status === "Completed" && r.finalStatus !== "Completed") {
        r.finalStatus = "Completed";
        r.completedAt = r.completedAt || new Date();
      }

      if (r.status === "On Hold" && r.finalStatus !== "On Hold") {
        r.finalStatus = "On Hold";
        r.onHoldAt = r.onHoldAt || new Date();
      }
    });

    // task-level status
    const allCompleted = this.remarks.every((r) => r.status === "Completed");
    const anyInProgress = this.remarks.some((r) => r.status === "In Progress");
    const anyOnHold = this.remarks.some((r) => r.status === "On Hold");

    if (allCompleted) this.status = "Completed";
    else if (anyInProgress) this.status = "In Progress";
    else if (anyOnHold) this.status = "On Hold";
    else this.status = "Pending";

    // task-level lifecycle status
    if (this.status === "Completed" && this.finalStatus !== "Completed") {
      this.finalStatus = "Completed";
      this.completedAt = this.completedAt || new Date();
    }

    if (this.status === "On Hold" && this.finalStatus !== "On Hold") {
      this.finalStatus = "On Hold";
      this.onHoldAt = this.onHoldAt || new Date();
    }
  } else {
    this.totalTimeSpent = 0;
    this.status = "Pending";
    this.finalStatus = "Pending";
  }

  next();
});

taskSchema.index({ employeeId: 1, date: 1 });
taskSchema.index({ "remarks.status": 1 });

export default mongoose.model("Task", taskSchema);
