const express = require('express');
const { loginInstructor, addInstructor, getInstructors, getInstructorById, updateInstructor, deleteInstructor } = require('../controller/instructorController');
const validateInstructor = require('../middleware/validateInstructor');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// Public route - no auth required
router.post('/login', loginInstructor);

// Protected routes - require auth
router.post('/add', authMiddleware, authorizeRole('admin'), validateInstructor, addInstructor);
router.get('/', authMiddleware, authorizeRole('admin'), getInstructors);
router.get('/:id', authMiddleware, authorizeRole('admin', 'instructor'), getInstructorById);
router.put('/:id', authMiddleware, authorizeRole('admin'), updateInstructor);
router.delete('/:id', authMiddleware, authorizeRole('admin'), deleteInstructor);

module.exports = router;
