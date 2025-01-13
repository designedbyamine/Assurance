const mongoose = require("mongoose");

const ConstatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,

    },
    location: {
      type: String,
      required: true,

    },
    dateTime: {
      type: Date,

    },
    description: {
      type: String,
      required: true,

    },
    photos: [
      {
        type: String, // Stores file paths of uploaded photos
      },
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
    },
    assignedExpert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model for assigned expert
      default: null, // Initially, no expert is assigned
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Done", "Rejected" ], // Status values
      default: "Pending", // Default status is "Pending"
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

const Constat = mongoose.model("Constat", ConstatSchema);

module.exports = Constat;
