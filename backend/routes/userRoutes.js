const express = require('express');
const router = express.Router();
const userControler = require('../controller/userController');
const enrollmentController = require('../controller/enrollmentController');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

router.get('/me', authMiddleware, userControler.getMe);
router.put('/profile', authMiddleware, userControler.updateMe);
router.get('/getAllUser', authMiddleware, authorizeRole('admin'), userControler.getUsers);
router.put('/update/:id', authMiddleware, authorizeRole('admin'), userControler.updateUser);
router.get('/get/:id', authMiddleware, authorizeRole('admin'), userControler.getUserById);
router.delete('/delete/:id', authMiddleware, authorizeRole('admin'), userControler.deleteUser);
router.get('/courses', authMiddleware, enrollmentController.getMyEnrollments);

module.exports = router;
