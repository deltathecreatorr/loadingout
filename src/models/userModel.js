// Creating the userSchema for the MongoDB database, requiring username, email, and password for users to even sign up.

import mongoose from "mongoose";

// Each schema maps to a MongoDB collection, essentially a blueprint for how data is organised in the database.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Provide a unique username"],
    unique: true,
    trim: true,
    minlength: [5, "Username must be at least 5 characters long"],
  },

  email: {
    type: String,
    required: [true, "Provide a valid email address"],
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "Provide a valid password"],
    minlength: [8, "Password must be at least 8 characters long"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
