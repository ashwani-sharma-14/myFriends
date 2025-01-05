"use strict";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET; //jwt_secret 


//Jwt verification middleware 
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;//cookie access
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.user = decoded; //data from payloads is decoded.
   return  next();
  });
};






