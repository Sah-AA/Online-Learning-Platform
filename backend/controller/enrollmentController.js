const mongoose = require('mongoose');
const courseModel = require('../models/courseModel');
const enrollmentModel = require('../models/enrollmentModel');

// POST /courses/:id/enroll
const enrollInCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { paymentMethod = 'unknown', transactionId } = req.body || {};

    // Find course by id or slug
    let course = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      course = await courseModel.findById(id);
    }
    if (!course) {
      course = await courseModel.findOne({ slug: id });
    }
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existing = await enrollmentModel
      .findOne({ user: userId, course: course._id })
      .populate('course');
    if (existing) {
      return res.status(200).json({ message: 'Already enrolled', alreadyEnrolled: true, enrollment: existing });
    }

    const enrollment = await enrollmentModel.create({
      user: userId,
      course: course._id,
      paymentMethod,
      paymentStatus: 'paid',
      transactionId,
    });

    // Populate course for frontend convenience
    await enrollment.populate('course');

    return res.status(201).json({ message: 'Enrolled successfully', alreadyEnrolled: false, enrollment });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /users/courses
const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await enrollmentModel
      .find({ user: userId })
      .populate('course')
      .sort({ createdAt: -1 });

    return res.status(200).json({ courses: enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
};
