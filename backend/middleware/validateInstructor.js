const validateInstructor = (req, res, next) => {
    const { username, email, password, phone, gender } = req.body;

    if (!username || !email || !password || !phone || !gender) {
        return res.status(400).json({ message: 'Username, email, password, phone and gender are required' });
    }

    next();
};

module.exports = validateInstructor;
