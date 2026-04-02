const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const userModel = require('../models/userModel');

const SECRET_KEY = process.env.JWT_SECRET;

const registerSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits',
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  role: Joi.string().valid('user', 'instructor', 'admin').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signup = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password, phone, gender, role } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      role: role || undefined,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, SECRET_KEY, { expiresIn: '1d' });

    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: 'User registered successfully', token, user: { id: newUser._id, username, email, role: newUser.role } });
  } catch (err) {
    console.error('Error in signup:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const signin = async (req, res) => {
  console.log('Signin request body:', req.body);
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });

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
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
      });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const signout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });
    return res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { signup, signin, signout };
