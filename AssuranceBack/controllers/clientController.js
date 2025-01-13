const User = require('../models/User'); // Adjust path if necessary
const Constat = require('../models/Constat');
const bcrypt = require('bcrypt');

// Get the client's profile
const getClientProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract logged-in user ID from token
    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user || user.role !== 'client') {
      return res.status(404).json({ message: 'Client profile not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateClientProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Extract logged-in user ID from token
      const updates = req.body;
  
      const allowedUpdates = ['name', 'email']; // Only allow name and email to be updated directly
      const isValidUpdate = Object.keys(updates).every(key => allowedUpdates.includes(key));
  
      if (!isValidUpdate && !updates.oldPassword) {
        return res.status(400).json({ message: 'Invalid updates' });
      }
  
      const user = await User.findById(userId);
  
      if (!user || user.role !== 'client') {
        return res.status(404).json({ message: 'Client profile not found' });
      }
  
      // If oldPassword and newPassword are provided, validate them and update the password
      if (updates.oldPassword && updates.password) {
        const isOldPasswordCorrect = await bcrypt.compare(updates.oldPassword, user.password);
        if (!isOldPasswordCorrect) {
          return res.status(400).json({ message: 'Incorrect old password' });
        }
  
        // Hash the new password and update it
        user.password = await bcrypt.hash(updates.password, 10);
      }
  
      // Update allowed fields like name and email
      if (updates.name) {
        user.name = updates.name;
      }
      if (updates.email) {
        user.email = updates.email;
      }
  
      await user.save();
  
      const updatedUser = user.toObject();
      delete updatedUser.password; // Exclude password from response
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
// Get constats posted by the logged-in client
const getClientConstats = async (req, res) => {
    try {
      const userId = req.user.id; // Extract logged-in user ID from token
  
      // Find constats where the client is the logged-in user
      const constats = await Constat.find({ client: userId });
  
      if (!constats || constats.length === 0) {
        return res.status(404).json({ message: 'No constats found for this client' });
      }
  
      res.status(200).json(constats);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

module.exports = {
  getClientProfile,
  updateClientProfile,
  getClientConstats,
};
