import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const dbURL= process.env.DB_URL;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.error("error while connecting to db:", err);
  });