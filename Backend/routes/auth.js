import { LoginController, LogoutController, SigninController, refreshAccessTokenController } from "../controllers/AuthController.js";
import { verifyJWT } from "../middleware/AuthMiddleware.js";
import { Router } from "express";

const router = Router();

router.post("/signin",SigninController);
router.post("/login",LoginController);
router.post("/logout",verifyJWT,LogoutController);
router.post("/refresh",refreshAccessTokenController);

export default router; 