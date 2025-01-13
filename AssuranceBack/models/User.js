const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'admin', 'expert'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: function () {
      return this.role === 'expert' ? 'Pending' : 'Active';
    },
  },
}, { timestamps: true });

// Create the User model
module.exports = mongoose.model('User', userSchema);
