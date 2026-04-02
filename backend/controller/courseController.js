const Joi = require('joi');
const courseModel = require('../models/courseModel');
const userModel = require('../models/userModel');

// Validation schemas
const courseCreateSchema = Joi.object({
  slug: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  title: Joi.string().trim().required(),
  price: Joi.number().positive().required(),
  instructorId: Joi.string().required(),
  titleHighlight: Joi.string().allow('', null),
  titleSuffix: Joi.string().allow('', null),
  subtitle: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  roadmap: Joi.string().allow('', null),
  youtubeUrl: Joi.string().allow('', null),
  learnButtonText: Joi.string().allow('', null),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
});

const courseUpdateSchema = Joi.object({
  slug: Joi.string().trim().optional(),
  name: Joi.string().trim().optional(),
  title: Joi.string().trim().optional(),
  titleHighlight: Joi.string().allow('', null),
  titleSuffix: Joi.string().allow('', null),
  subtitle: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  roadmap: Joi.string().allow('', null),
  youtubeUrl: Joi.string().allow('', null),
  learnButtonText: Joi.string().allow('', null),
  price: Joi.number().positive().optional(),
  instructorId: Joi.string().optional(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
});

const addCourse = async (req, res) => {
  try {
    const { error } = courseCreateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
      slug,
      name,
      title,
      price,
      instructorId,
      titleHighlight,
      titleSuffix,
      subtitle,
      description,
      roadmap,
      youtubeUrl,
      learnButtonText,
      tags,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const instructor = await userModel.findOne({ _id: instructorId, role: 'instructor' });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const normalizedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string' && tags.length
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    const course = new courseModel({
      slug,
      name,
      title,
      titleHighlight,
      titleSuffix,
      subtitle,
      description,
      roadmap,
      youtubeUrl,
      learnButtonText,
      price,
      image,
      instructor: instructorId,
      tags: normalizedTags,
    });

    await course.save();
    res.status(201).json({ message: 'Course added successfully', course });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const courses = await courseModel
      .find()
      .populate('instructor', 'username email')
      .skip((page - 1) * limit)
      .limit(Math.min(parseInt(limit), 50));

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const courses = await courseModel.find({ instructor: id }).populate('instructor', 'username email');
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const editCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = courseUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
      slug,
      name,
      title,
      titleHighlight,
      titleSuffix,
      subtitle,
      description,
      roadmap,
      youtubeUrl,
      learnButtonText,
      price,
      instructorId,
      tags,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (instructorId) {
      const instructor = await userModel.findOne({ _id: instructorId, role: 'instructor' });
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor not found' });
      }
    }

    const normalizedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string' && tags.length
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : undefined;

    const update = {
      slug,
      name,
      title,
      titleHighlight,
      titleSuffix,
      subtitle,
      description,
      roadmap,
      youtubeUrl,
      learnButtonText,
      price,
      instructor: instructorId,
    };
    if (image) update.image = image;
    if (normalizedTags) update.tags = normalizedTags;

    const updatedCourse = await courseModel.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    console.error('Error editing course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await courseModel.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseModel.findById(id).populate('instructor', 'username email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { 
  addCourse, 
  getCourses, 
  getInstructorCourses,
  editCourse, 
  deleteCourse, 
  getCourseById 
};
