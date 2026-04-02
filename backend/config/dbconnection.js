// config/dbconnection.js
const mongoose = require('mongoose');

const dbconnection = () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((err) => {
      console.error('Database connection failed:', err);
    });
};

module.exports = dbconnection;
