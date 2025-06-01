const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const mailSender = require("../utils/mailSender");

// 🔁 Reuse your existing enrollStudents function
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" });
  }

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(200).json({ success: true, message: "Student enrolled successfully" });
};

// 👇 Main controller to test enrollment manually
exports.testManualEnrollment = async (req, res) => {
  const { userId, courses } = req.body;

  if (!userId || !courses || courses.length === 0) {
    return res.status(400).json({ success: false, message: "Missing userId or courses" });
  }

  try {
    await enrollStudents(courses, userId, res);
  } catch (error) {
    console.error("Manual enrollment error:", error);
    return res.status(500).json({ success: false, message: "Manual enrollment failed" });
  }
};
