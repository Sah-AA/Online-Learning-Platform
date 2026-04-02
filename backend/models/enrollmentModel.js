const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['qr', 'card', 'unknown'],
    default: 'unknown',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'paid',
  },
  transactionId: {
    type: String,
  },
}, { timestamps: true });

// Prevent duplicate enrollments for the same user/course pair
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const enrollmentModel = mongoose.model('Enrollment', enrollmentSchema);

module.exports = enrollmentModel;
