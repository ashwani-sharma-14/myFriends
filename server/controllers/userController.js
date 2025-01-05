"use strict";

import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

export const getSignup = (req, res, next) => {
  return res.status(200).json({ message: "signup route" });
};

export const UserSignUp = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        email: email,
        name: name,
        phone: phone,
        hash: hash,
        salt: salt,
      });
      return res.status(200).json({ message: "user registered successfully" });
    } else {
      return res.status(200).json({ message: "user exists" });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getLogin = (req, res, next) => {
  return res.status(200).json({ message: "login route" });
};

export const UserLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "user not found" });
    const isMatch = await bcrypt.compare(password, user.hash);
    if (!isMatch) return res.json({ message: "user login failed" });
    const token = jwt.sign({ email: user.email }, secret, {
      expiresIn: process.env.JWT_TIMEOUT,
    });
    return res
      .cookie("access_token", token, { httpOnly: true })
      .json({ message: "user Login successFully", email, token });
  } catch (err) {
    console.error({ error: err.message });
    next(err);
  }
};
