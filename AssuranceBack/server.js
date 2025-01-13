const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

// Import routes
const constatRoutes = require("./routes/constatRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require('./routes/adminRoutes');
const clientRoutes = require('./routes/clientRoutes');
const expertRoutes = require('./routes/expertRoutes');


// Import User model
const User = require("./models/User"); // Make sure the path is correct

// Initialize the app
const app = express();

// Load environment variables
dotenv.config();

// Middleware for parsing incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Static file serving for uploads (temporary, you might want to configure this in production)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes for authentication and constats
app.use("/api/auth", authRoutes);
app.use("/api/constats", constatRoutes);
//routes for admin 
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/expert', expertRoutes);



// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit the process with failure
  }
};

// Function to create a default admin user
const createDefaultAdmin = async () => {
  try {
    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      // Create the admin user
      const hashedPassword = await bcrypt.hash("123", 10); // Securely hash the password
      const adminUser = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      });

      await adminUser.save();
      console.log("Default admin user created: admin@gmail.com / 123");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

// Start the server
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    await createDefaultAdmin(); // Create the default admin user

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

// Start the server
startServer();
