const mongoose = require("mongoose");
const Course = require("../models/Course");

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  console.log("Received data:", req.body); // Log the incoming data
  const course = new Course({
    title: req.body.title,
    department: req.body.department,
    level: req.body.level,
    semester: req.body.semester,
    credits: req.body.credits,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course == null) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a course
// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update course fields
    course.title = req.body.title || course.title;
    course.department = req.body.department || course.department;
    course.level = req.body.level || course.level;
    course.semester = req.body.semester || course.semester;
    course.credits = req.body.credits || course.credits;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  console.log("delete request received\n");
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (course == null) {
      console.log("Course not found");
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Generate report with filters using Aggregation Framework
// Backend - CourseController.js

// Backend - CourseController.js

exports.generateReport = async (req, res) => {
  try {
    const { department, level, semester } = req.query;
    console.log("Received filters:", { department, level, semester });

    // Build the match stage based on provided filters
    let matchStage = {};
    if (department) matchStage.department = department;
    if (level) matchStage.level = level;
    if (semester) matchStage.semester = semester;

    console.log("Match Stage:", matchStage);

    // Aggregation pipeline to get courses and statistics
    const report = await Course.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCredits: { $sum: "$credits" },
          totalCourses: { $sum: 1 },
          courses: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          averageCredits: {
            $cond: {
              if: { $eq: ["$totalCourses", 0] },
              then: 0,
              else: { $divide: ["$totalCredits", "$totalCourses"] },
            },
          },
          totalCourses: 1,
          courses: 1,
        },
      },
    ]);

    // If no courses are found, return default values
    const result = report[0] || {
      averageCredits: 0,
      totalCourses: 0,
      courses: [],
    };
    res.json(result);
  } catch (err) {
    console.error("Error in generateReport:", err);
    res.status(500).json({ message: err.message });
  }
};
