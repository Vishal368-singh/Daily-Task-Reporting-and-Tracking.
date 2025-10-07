// models/AuditLog.js
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    collection: { type: String, required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE"],
      required: true,
    },
    performedBy: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", auditLogSchema);
