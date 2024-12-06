// This file defines the routes for managing courses in the application,
// including operations to get all courses, create a new course,
// retrieve a course by ID, update a course, and delete a course.

const express = require("express");
const router = express.Router();
const CourseController = require("../controllers/CourseController");

// CRUD operations
router.get("/report", CourseController.generateReport); // Place this before '/:id'
router.get("/", CourseController.getAllCourses);
router.post("/", CourseController.createCourse);
router.get("/:id", CourseController.getCourseById); // Now '/:id' won't conflict with '/report'
router.put("/:id", CourseController.updateCourse);
router.delete("/:id", CourseController.deleteCourse);

module.exports = router;
