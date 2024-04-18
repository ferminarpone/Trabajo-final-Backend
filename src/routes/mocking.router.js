import { Router } from "express";
import { getProductsMockingController } from "../controllers/mocking.controller.js";

const router = Router();

router.get("/", getProductsMockingController);

export default router;
