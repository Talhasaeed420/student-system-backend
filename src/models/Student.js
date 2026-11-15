const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    course: { type: String, required: true, trim: true },
    year: { type: Number, min: 1, max: 6, default: 1 },
    gpa: { type: Number, min: 0, max: 4, default: 0 },
    status: { type: String, enum: ["active", "graduated", "suspended"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
