import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const uri = process.env.MONGO_URL || "mongodb://localhost:27017/Roadmaps";

try {
  MongoClient.connect(uri).then(() => console.log("connected!"));
} catch (err) {
  console.log(err);
}

app.listen(5000, () => console.log("Running!"));