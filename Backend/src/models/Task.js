// models/Task.js
import mongoose from "mongoose";

const remarkSchema = new mongoose.Schema({
  moduleName: { type: String, required: true },
  text: { type: String, required: true, maxlength: 200 },
  status: {
    type: String,
    enum: ["In Progress", "On Hold", "Completed"],
    default: "In Progress",
  },
  finalStatus: {
    type: String,
    enum: ["In Progress", "On Hold", "Completed"],
    default: "In Progress",
  },

  minutes: { type: Number, default: 0, min: 0 },
  workDate: { type: Date, default: Date.now },
  completedAt: { type: Date },
  onHoldAt: { type: Date },
});

// REMOVED: moduleRemarkSchema is no longer needed with the flat structure.

const taskSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true },
    employeeId: { type: String, required: true, index: true },
    team: { type: String, required: true },
    project: { type: String, required: true },
    module: { type: [String], required: true },
    activity_lead: { type: String, required: true },
    date: { type: Date, required: true },

    remarks: { type: [remarkSchema], default: [] },
    moduleRemarks: { type: Object, select: false },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "On Hold", "Completed"],
      default: "Pending",
    },
    finalStatus: {
      type: String,
      enum: ["Pending", "In Progress", "On Hold", "Completed"],
      default: "Pending",
    },
    completedAt: { type: Date },
    onHoldAt: { type: Date },
    totalTimeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

taskSchema.pre("save", function (next) {
  if (!this.isModified("moduleRemarks")) {
    return next();
  }

  const flatRemarks = [];
  Object.entries(this.moduleRemarks || {}).forEach(
    ([moduleName, remarkList]) => {
      if (Array.isArray(remarkList)) {
        const processedRemarks = remarkList.map((remark) => ({
          moduleName: moduleName,
          text: remark.text || "",
          status: remark.status || "In Progress",
          finalStatus: remark.status || "In Progress",
          minutes: remark.time || 0,
          workDate: new Date(),
          completedAt: remark.status === "Completed" ? new Date() : undefined,
          onHoldAt: remark.status === "On Hold" ? new Date() : undefined,
        }));
        flatRemarks.push(...processedRemarks);
      }
    }
  );

  this.remarks = flatRemarks;

  this.totalTimeSpent = this.remarks.reduce(
    (sum, r) => sum + (r.minutes || 0),
    0
  );

  const allCompleted =
    this.remarks.length > 0 &&
    this.remarks.every((r) => r.status === "Completed");
  const anyInProgress = this.remarks.some((r) => r.status === "In Progress");
  const anyOnHold = this.remarks.some((r) => r.status === "On Hold");

  if (allCompleted) this.status = "Completed";
  else if (anyInProgress) this.status = "In Progress";
  else if (anyOnHold) this.status = "On Hold";
  else this.status = "Pending";

  if (this.status === "Completed" && this.finalStatus !== "Completed") {
    this.finalStatus = "Completed";
    this.completedAt = this.completedAt || new Date();
  }

  if (this.status === "On Hold" && this.finalStatus !== "On Hold") {
    this.finalStatus = "On Hold";
    this.onHoldAt = this.onHoldAt || new Date();
  }

  this.moduleRemarks = undefined;

  next();
});

taskSchema.index({ employeeId: 1, date: 1 });

export default mongoose.model("Task", taskSchema);
