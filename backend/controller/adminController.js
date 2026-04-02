const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      return res.status(500).json({ message: 'Admin credentials not configured' });
    }

    if (email !== adminEmail) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, adminPasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: 'Login successful', token, user: { email: adminEmail, role: 'admin' } });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginAdmin };
