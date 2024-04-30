import { Router } from "express";
import { sendEmailController, sendEmailToResetPassController} from "../controllers/email.controller.js";

const router = Router();

router.get("/", sendEmailController);
router.post('/sendEmailToResetPass', sendEmailToResetPassController )

export default router;
