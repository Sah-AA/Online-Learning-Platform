const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');
const enrollmentController = require('../controller/enrollmentController');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const upload = multer({ dest: 'uploads/' });
router.post('/add', authMiddleware, authorizeRole('admin', 'instructor'), upload.single('image'), courseController.addCourse);
router.get('/', courseController.getCourses);
router.get('/get/:id', courseController.getCourseById);
router.get('/instructor/:id', courseController.getInstructorCourses);
router.post('/:id/enroll', authMiddleware, enrollmentController.enrollInCourse);
router.get('/:id', courseController.getCourseById);
router.put('/edit/:id', authMiddleware, authorizeRole('admin', 'instructor'), upload.single('image'), courseController.editCourse);
router.delete('/delete/:id', authMiddleware, authorizeRole('admin'), courseController.deleteCourse);

module.exports = router;
