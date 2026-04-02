const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

const loginInstructor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const instructor = await userModel.findOne({ email, role: 'instructor' });
        if (!instructor) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, instructor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: instructor._id, role: instructor.role }, SECRET_KEY, { expiresIn: '1d' });

        return res
            .cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({
                message: 'Login successful',
                token,
                user: { id: instructor._id, username: instructor.username, email: instructor.email, role: instructor.role },
            });
    } catch (error) {
        console.error('Instructor login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addInstructor = async (req, res) => {
    try {
        const { username, email, password, phone, gender } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const instructor = new userModel({
            username,
            email,
            password: hashedPassword,
            phone,
            gender,
            role: 'instructor',
        });

        await instructor.save();

        res.status(201).json({ message: 'Instructor added successfully', instructor });
    } catch (error) {
        console.error('Error adding instructor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getInstructors = async (req, res) => {
    try {
        const instructors = await userModel.find({ role: 'instructor' });
        res.status(200).json({ instructors });
    } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteInstructor = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedInstructor = await userModel.findOneAndDelete({ _id: id, role: 'instructor' });
  
      if (!deletedInstructor) {
        return res.status(404).json({ message: 'Instructor not found' });
      }
  
      res.status(200).json({ message: 'Instructor deleted successfully', deletedInstructor });
    } catch (error) {
      console.error('Error deleting instructor:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getInstructorById = async (req, res) => {
    try {
      const { id } = req.params;
      const instructor = await userModel.findOne({ _id: id, role: 'instructor' });
  
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor not found' });
      }
  
      res.status(200).json({ instructor });
    } catch (error) {
      console.error('Error fetching instructor:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const updateInstructor = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, email, phone, gender } = req.body;
      const update = {};
      if (username) update.username = username;
      if (email) update.email = email;
      if (phone) update.phone = phone;
      if (gender) update.gender = gender;
      if (password) {
        update.password = await bcrypt.hash(password, 10);
      }

      const updatedInstructor = await userModel.findOneAndUpdate(
        { _id: id, role: 'instructor' },
        update,
        { new: true }
      );
  
      if (!updatedInstructor) {
        return res.status(404).json({ message: 'Instructor not found' });
      }
  
      res.status(200).json({ message: 'Instructor updated successfully', updatedInstructor });
    } catch (error) {
      console.error('Error updating instructor:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
    loginInstructor,
    addInstructor,
    getInstructors,
    deleteInstructor,
    getInstructorById,
    updateInstructor,
};
