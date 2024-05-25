import { SigninController } from "../controllers/AuthController";

const router = require("express").Router();

router.post("/signin",SigninController);