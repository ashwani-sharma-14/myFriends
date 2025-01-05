"use strict";
import express from "express";
const router = express.Router();
import {
  UserSignUp,
  UserLogin,
  getLogin,
  getSignup,
  getUserDashboard,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendList,
  getPendingFriendRequests,
  getMutualFriends,
  deleteFriendRequest,
} from "../controllers/userController.js"; //imported all the function from UserController file

import { verifyToken } from "../middleware/authentication.js"; //jwt verification middleware

//Sign up Routes
router.route("/signup").get(getSignup).post(UserSignUp);
//Login Routes
router.route("/login").get(getLogin).post(UserLogin);

//user data to userHome
router.get("/dashboard", verifyToken, getUserDashboard);

//routes for sending, accepting and deleting friendrequest and also the friend request 
router.post("/sendFriendRequest/:toUserId", verifyToken, sendFriendRequest);
router.post(
  "/acceptFriendRequest/:fromUserId",
  verifyToken,
  acceptFriendRequest
);
router.get("/friends", verifyToken, getFriendList);
router.get("/friendRequests", verifyToken, getPendingFriendRequests);
router.get("/mutualFriends/:otherUserId", verifyToken, getMutualFriends);//mutual friend request 
router.delete(
  "/deleteFriendRequest/:fromUserId",
  verifyToken,
  deleteFriendRequest
);

export { router as userRouter };
