import { CreateFileController } from "../controllers/FileController.js";
import { verifyJWT } from "../middleware/AuthMiddleware.js";
import { Router } from "express";

const router = Router();

router.post("/create",verifyJWT,CreateFileController);