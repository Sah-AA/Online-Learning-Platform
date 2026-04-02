require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;

// DB connection
const dbconnection = require('./config/dbconnection');

// Connect to DB
dbconnection();

// Middleware (before routes)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
const userRouter = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoute');
const instructorRoutes = require('./routes/instructorRoute');
const adminRoutes = require('./routes/adminRoute');
const authRoutes = require('./routes/authRoute');

// Mount routes (before static)
app.use('/users', userRouter);
app.use('/courses', courseRoutes);
app.use('/instructors', instructorRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

// Serve uploaded images statically (after routes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
