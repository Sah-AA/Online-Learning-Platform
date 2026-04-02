const mongoose = require('mongoose');

// Syllabus section schema
const syllabusSchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: [{ type: String }],
}, { _id: false });

// Title parts schema for complex titles
const titlePartSchema = new mongoose.Schema({
  text: { type: String, required: true },
  highlight: { type: Boolean, default: false },
}, { _id: false });

const courseSchema = new mongoose.Schema({
  // URL-friendly identifier (e.g., "web-dev-cohort")
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // Title display fields
  title: {
    type: String,
    required: true,
  },
  titleHighlight: {
    type: String,
  },
  titleSuffix: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  titleParts: [titlePartSchema],
  description: {
    type: String,
  },
  // Images
  image: {
    type: String,
    required: true,
  },
  roadmap: {
    type: String,
  },
  // Pricing
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  displayPrice: {
    type: Number,
  },
  baseAmount: {
    type: Number,
  },
  platformFees: {
    type: Number,
  },
  gst: {
    type: Number,
  },
  // Course details
  batchDate: {
    type: String,
  },
  youtubeUrl: {
    type: String,
  },
  learnButtonText: {
    type: String,
    default: 'Learn Free',
  },
  tags: [{
    type: String,
  }],
  syllabus: [syllabusSchema],
  // Instructor reference
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const courseModel = mongoose.model('course', courseSchema);

module.exports = courseModel;
