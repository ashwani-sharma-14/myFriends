"use strict";
import express from "express";
const router = express.Router();
import {
  UserSignUp,
  UserLogin,
  getLogin,
  getSignup,
} from "../controllers/userController.js";

import { verifyToken } from "../middleware/authentication.js";



router.route("/signup").get(getSignup).post(UserSignUp);

router.route("/login").get(getLogin).post(UserLogin);

router.get("/dashboard",verifyToken,(req,res,next)=>{
    res.send("you are logged in");
})

export {router as userRouter };