const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: String, required: true },
  semester: { type: String, required: true },
  credits: { type: Number, required: true },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

CourseSchema.index({ department: 1, level: 1, semester: 1 });

module.exports = mongoose.model("Course", CourseSchema);
