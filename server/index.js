"use strict";

//importing packages
import express from "express"; 
const app = express();
import "./database/dbconnection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
dotenv.config();//configuring dotenv for environment variables
const port = process.env.PORT || 6000;

//enabling cors for connecting with fronent.
const corsOptions = {
  origin: [
    "http://localhost:5173",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

//using parsing middleware functions
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//routes
import { userRouter } from "./routes/userRoutes.js";

//route middleware 
app.use("/user", userRouter);

//error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "something went wrong";
  res
    .status(statusCode)
    .json({ message: message, statusCode: statusCode, success: false });
});

//server listing
app.listen(port, () => {
  console.log("server is listinig at port:", port);
});
