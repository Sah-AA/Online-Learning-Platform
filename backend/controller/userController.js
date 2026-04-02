const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    return res.status(200).json(users);
  } catch (err) {
    console.error('Error in getUsers:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, gender, password, role } = req.body;

    const existingUserWithEmail = await userModel.findOne({ email });
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== id) {
      return res.status(400).json({ message: 'Email is already in use by another user.' });
    }

    const updatedData = { username, email, phone, gender };

    if (role) {
      const allowed = ['user', 'admin', 'instructor'];
      if (!allowed.includes(role)) {
        return res.status(400).json({ message: 'Invalid role value.' });
      }
      updatedData.role = role;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await userModel.findByIdAndUpdate(id, updatedData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error('Error in updateUser:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error in deleteUser:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error('Error in getUserById:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error('Error in getMe:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateMe = async (req, res) => {
  try {
    const id = req.user.id;
    const { username, email, phone, gender, password } = req.body;

    if (email) {
      const existingUserWithEmail = await userModel.findOne({ email });
      if (existingUserWithEmail && existingUserWithEmail._id.toString() !== id) {
        return res.status(400).json({ message: 'Email is already in use by another user.' });
      }
    }

    const updatedData = { username, email, phone, gender };

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await userModel.findByIdAndUpdate(id, updatedData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error in updateMe:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser, getUserById, getMe, updateMe };
