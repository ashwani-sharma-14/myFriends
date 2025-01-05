"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    requires: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please fill a valid 10-digit phone number"],
  },
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
