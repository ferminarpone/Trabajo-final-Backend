import { Router } from "express";
import { resetPasswordController } from "../controllers/settings.controller.js";

const router = Router();

router.post('/reset-password/:token', resetPasswordController) 

export default router;