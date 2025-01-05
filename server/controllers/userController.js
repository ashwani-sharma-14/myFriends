"use strict";

import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

// userSignup functions
export const getSignup = (req, res, next) => {
  return res.status(200).json({ message: "signup route" });
};

export const UserSignUp = async (req, res, next) => {
  const { name, email, phone, password } = req.body; //getting user information from body
  try {
    //password hashing
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    //checking user in the database
    let user = await User.findOne({ email: email });
    if (!user) {
      //adding new user
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
    return next(err);
  }
};

//Login functions

export const getLogin = (req, res, next) => {
  return res.status(200).json({ message: "login route" });
};

export const UserLogin = async (req, res, next) => {
  const { email, password } = req.body; //getting user information from body
  try {
    //cheching users from database
    const user = await User.findOne({ email: email });

    if (!user) return res.status(404).json({ message: "user not found" });

    // password Matching and verification
    const isMatch = await bcrypt.compare(password, user.hash);
    if (!isMatch) return res.json({ message: "user login failed" });

    //creating token
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: process.env.JWT_TIMEOUT,
    });
    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ message: "user Login successFully", email, token }); // parsing token in the form of cookies
  } catch (err) {
    console.error({ error: err.message });
    return next(err);
  }
};

//user Home function
export const getUserDashboard = async (req, res, next) => {
  const { email } = req.user;

  try {
    // retrieving all the users availlable in datBase
    const users = await User.find(
      { email: { $ne: email } },
      { hash: 0, salt: 0 }
    );

    //User available in dataBase or not
    if (!users) return res.satus(401).json({ message: "user not round" });
    return res.status(200).json({ message: "data receives", users: users });
  } catch (err) {
    return next(err);
  }
};

//Friend adding deleting functions
export const sendFriendRequest = async (req, res, next) => {
  const fromUserId = req.user.id; //sender id obtained from verification middleWare
  const { toUserId } = req.params; // reciever  id from params

  try {
    const fromUser = await User.findById(fromUserId); //checking sender in database
    const toUser = await User.findById(toUserId); //cheking reciever in the dataBase

    if (!toUser) return res.status(404).json({ message: "User not found" });

    //checking senderId availble in request array
    if (toUser.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    //checking senderId availble in friends array
    if (toUser.friends.includes(fromUserId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    //adding request to reciver request list
    toUser.friendRequests.push(fromUserId);
    await toUser.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    return next(err);
  }
};

export const acceptFriendRequest = async (req, res, next) => {
  const toUserId = req.user.id; //sender id obtained from verification middleWare
  const { fromUserId } = req.params; //cheking reciever in the dataBase

  try {
    const toUser = await User.findById(toUserId);
    const fromUser = await User.findById(fromUserId);

    if (!toUser || !fromUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // checking request is available or not
    if (!toUser.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ message: "No friend request found" });
    }

    //filtering all the reuests
    toUser.friendRequests = toUser.friendRequests.filter(
      (id) => id.toString() !== fromUserId
    );

    //adding friend
    toUser.friends.push(fromUserId);
    fromUser.friends.push(toUserId);

    await toUser.save();
    await fromUser.save();

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    return next(err);
  }
};

export const getFriendList = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("friends", "name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user.friends);
  } catch (err) {
    return next(err);
  }
};

export const getPendingFriendRequests = async (req, res, next) => {
  const userId = req.user.id; //userId from verification middleWare

  try {
    //checking reuests
    const user = await User.findById(userId).populate(
      "friendRequests",
      "name email"
    );
    //sendind request to client
    return res.status(200).json(user.friendRequests);
  } catch (err) {
    return next(err);
  }
};

export const deleteFriendRequest = async (req, res, next) => {
  const toUserId = req.user.id; // The logged-in user
  const { fromUserId } = req.params; // The user who sent the request

  try {
    const toUser = await User.findById(toUserId);
    const fromUser = await User.findById(fromUserId);

    if (!toUser || !fromUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the friend request exists
    if (!toUser.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ message: "Friend request not found" });
    }

    // Remove the friend request
    toUser.friendRequests = toUser.friendRequests.filter(
      (id) => id.toString() !== fromUserId
    );
    await toUser.save();

    res.status(200).json({ message: "Friend request deleted" });
  } catch (err) {
    next(err);
  }
};

export const getMutualFriends = async (req, res, next) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  try {
    const user = await User.findById(userId);
    const otherUser = await User.findById(otherUserId);

    if (!user || !otherUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //checking similar friends with outher users
    const mutualFriends = user.friends.filter((friendId) =>
      otherUser.friends.includes(friendId.toString())
    );
    //getting details of all the mutual friends
    const mutualFriendsDetails = await User.find(
      { _id: { $in: mutualFriends } },
      "name email"
    );

    res.status(200).json(mutualFriendsDetails);
  } catch (err) {
    return next(err);
  }
};
