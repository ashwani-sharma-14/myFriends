"use strict";

import express from "express";
const app = express();
import "./database/dbconnection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const port = process.env.PORT || 6000;
app.use(express.json());
app.use(cookieParser());
import { userRouter } from "./routes/userRoutes.js";

app.use("/user", userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "something went wrong";
  res
    .status(statusCode)
    .json({ message: message, statusCode: statusCode, success: false });
});


app.listen(port, () => {
  console.log("server is listinig at port:", port);
});
