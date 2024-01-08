require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
 name: {
  type: String,
  required: [true, "Please provide the username"],
  maxLength: 50,
  trim: true,
 },
 email: {
  type: String,
  required: [true, "Please provide the email"],
  match: [
   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
   "Please provide a valid email",
  ],
  unique: true,
 },
 password: {
  type: String,
  required: [true, "Please provide the password"],
  minLength: 8,
 },
});

//Password Hashing using Mongoose middleware
userSchema.pre("save", async function () {
 const salt = await bcrypt.genSalt(10);
 this.password = await bcrypt.hash(this.password, salt);
});

//Custom instane method for password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
 const isMatch = await bcrypt.compare(candidatePassword, this.password);
 return isMatch;
};

//Custom instane method for token generation
userSchema.methods.createJWT = function () {
 return jwt.sign(
  { userID: this._id, name: this.name },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_LIFETIME }
 );
};

module.exports = mongoose.model("users", userSchema);
