const Constat = require('../models/Constat');
const User = require('../models/User');
const path = require('path');
const mongoose = require("mongoose");
const sendEmail = require('../utils/mailer');


// Multer setup for photo uploads

// Controller methods

// Create a new constat
exports.createConstat = async (req, res) => {
  const { type, location, dateTime, description } = req.body;

  try {
    // Validate file upload
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one file is required.' });
    }

    // Handle uploaded files
    const photos = req.files.map((file) => {
      const normalizedPath = path.join("/uploads", file.filename).replace(/\\/g, "/");
      return normalizedPath; // Ensure the path is forward-slash based
    });

    console.log("Uploaded photos:", photos);

    // Create a new constat
    const newConstat = new Constat({
      type,
      location,
      dateTime,
      description,
      photos,
      client: req.user.id, // Assuming authenticated user is the client
    });

    await newConstat.save();
    console.log("New constat created:", newConstat);

    res.status(201).json({ message: 'Constat created successfully', constat: newConstat });
  } catch (err) {
    console.error("Error creating constat:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getAvailableExperts = async (req, res) => {
    try {
      // Get all constats and their assigned experts
      const constats = await Constat.find({}).select('assignedExperts');
      console.log("All constats with assigned experts:", constats);
  
      // Collect IDs of assigned experts, handling the case where assignedExperts might be null
      const assignedExpertIds = constats.flatMap((constat) =>
        (constat.assignedExperts || []).map((expert) => expert.toString())
      );
      console.log("Assigned expert IDs:", assignedExpertIds);
  
      // Get experts who are not assigned to any constat
      const availableExperts = await User.find({
        role: "expert",
        _id: { $nin: assignedExpertIds } // Exclude experts who are already assigned
      });
      console.log("Available experts:", availableExperts);
  
      res.status(200).json(availableExperts);
    } catch (err) {
      console.error("Error fetching available experts:", err);
      res.status(500).json({ message: "Failed to fetch available experts." });
    }
  };
  

// Assign an expert to a constat
exports.assignExpert = async (req, res) => {
  try {
    const { expertId } = req.body; // Extract expertId from request body
    const { constatId } = req.params; // Extract constatId from request parameters

    if (!expertId) {
      return res.status(400).json({ message: 'Expert ID is required' });
    }

    // Validate expertId
    if (!mongoose.Types.ObjectId.isValid(expertId)) {
      return res.status(400).json({ message: 'Invalid expert ID' });
    }

    // Validate constatId
    if (!mongoose.Types.ObjectId.isValid(constatId)) {
      return res.status(400).json({ message: 'Invalid constat ID' });
    }

    // Check if expert exists
    const expert = await User.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    // Check if constat exists
    const constat = await Constat.findById(constatId);
    if (!constat) {
      return res.status(404).json({ message: 'Constat not found' });
    }

    // Assign expert to constat
    constat.assignedExpert = expertId;
    await constat.save();

    res.status(200).json({ message: 'Expert assigned successfully', constat });
  } catch (err) {
    console.error('Error assigning expert:', err);
    res.status(500).json({ message: 'Failed to assign expert. Please try again.' });
  }
};




// Update constat status (Expert Functionality)
exports.updateConstatByExpert = async (req, res) => {
  try {
    const { constatId } = req.params;
    const { status } = req.body;

    // Find and populate the client field to get the user's email
    const constat = await Constat.findById(constatId).populate('client');

    if (!constat) {
      return res.status(404).json({ message: 'Constat not found' });
    }

    // Update the status of the Constat
    constat.status = status;

    // Save the updated Constat
    await constat.save();

    // Notify the client about the status update
    const clientEmail = constat.client.email; // Access client's email after populating
    const subject = `Update on Your Constat: ${constat.type}`;  // or use other relevant field for title
    const html = `<p>Your constat status has been updated to: <strong>${status}</strong>.</p>`;

    // Send email to the client
    await sendEmail(clientEmail, subject, html);

    res.status(200).json({ message: 'Constat status updated and client notified', constat });
  } catch (error) {
    console.error('Error updating constat status:', error);
    res.status(500).json({ message: 'Error updating constat status', error: error.message });
  }
};
// Get all constats for an expert
exports.getConstatsForExpert = async (req, res) => {
  try {
    const constats = await Constat.find({ expert: req.user.id }).populate('client', 'name email');
    console.log("Constats fetched for expert:", constats);
    res.status(200).json({ constats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all constats with images
exports.getConstatsWithImages = async (req, res) => {
  try {
    // Fetch all constats and add full URLs to photos
    const constats = await Constat.find()
      .populate('client', 'name email')
      .populate('expert', 'name email');
    console.log("All constats with populated client and expert:", constats);
    
    // Add the full image URLs to the photos
    const constatsWithImages = constats.map(constat => {
      constat.photos = constat.photos.map(photo => {
        // Generate full URL for each photo
        return path.join('http://localhost:5000', photo); // Adjust the domain as needed
      });
      return constat;
    });

    res.status(200).json({ constats: constatsWithImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get constats assigned to a specific expert
exports.getConstatsForExpert = async (req, res) => {
  const expertId = req.user.id;  // Assuming you have the expert ID in the JWT token
  
  try {
    // Fetch constats that are assigned to the expert
    const constats = await Constat.find({ expert: expertId })
      .populate('client', 'name email')
      .populate('expert', 'name email');
    console.log("Constats assigned to expert:", constats);

    // Add the full image URLs to the photos
    const constatsWithImages = constats.map(constat => {
      constat.photos = constat.photos.map(photo => {
        // Generate full URL for each photo
        return path.join('http://localhost:5000', photo); // Adjust the domain as needed
      });
      return constat;
    });

    if (!constats.length) {
      return res.status(404).json({ message: 'No constats found for this expert' });
    }

    res.status(200).json({ constats: constatsWithImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all constats for an admin
exports.getAllConstats = async (req, res) => {
  try {
    const constats = await Constat.find().populate('client', 'name email').populate('assignedExpert', 'name email');
    console.log("All constats fetched for admin:", constats);
    res.status(200).json({ constats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get constats for a specific client
exports.getConstatsForClient = async (req, res) => {
  try {
    const { clientId } = req.params; // Retrieve clientId from URL parameters
    console.log("Fetching constats for clientId:", clientId);

    // Ensure clientId is valid
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: "Invalid clientId." });
    }

    // Query the database for constats associated with the clientId
    const constats = await Constat.find({ client: clientId }).populate('assignedExpert', 'name'); // Populate expert name

    // Check if constats exist
    if (!constats || constats.length === 0) {
      return res.status(404).json({ message: "No constats found for this client." });
    }

    return res.status(200).json(constats); // Return the constats
  } catch (error) {
    console.error("Error fetching constats:", error);
    return res.status(500).json({ message: "Error fetching constats." });
  }
};


// Admin Routes (protected routes for authenticated admins)
exports.deleteConstat = async (req, res) => {
  const { constatId } = req.params;

  try {
    // Find the constat by its ID
    const constat = await Constat.findById(constatId);
    if (!constat) {
      return res.status(404).json({ message: 'Constat not found' });
    }

    // Delete the constat
    await Constat.findByIdAndDelete(constatId);
    console.log("Constat deleted:", constat);

    res.status(200).json({ message: 'Constat deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
