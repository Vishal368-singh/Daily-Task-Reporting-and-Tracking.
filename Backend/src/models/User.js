import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    // **FIX 1: Renamed to 'role' for consistency**
    role: { type: String, enum: ["admin", "user"], default: "user" },
    team: {
      type: String,
      enum: ["Programmer", "GIS", null], 
      required: function () {
        return this.role === "user";
      },
    },
    employeeId: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

// Hash password before saving (This part is correct)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password for login (This part is correct)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
