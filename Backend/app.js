import express from "express";
import { MongoClient } from "mongodb";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"

import AuthRoutes from "./routes/auth.js";
import connectDB from "./db/connect.js";

dotenv.config({
  path: './.env'
})

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const uri = process.env.MONGO_URL;

connectDB()

app.listen(5000, () => console.log("Running!"));

app.use("/api/v1/user",AuthRoutes)