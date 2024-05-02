import { Router } from "express";
import * as ProductController from "../controllers/products.controller.js";

const router = Router();

router.get("/", ProductController.getProductsController);

router.get("/:pid", ProductController.getProductByIdController);

router.post("/", ProductController.createProductController);

router.put("/:pid", ProductController.updateProductController);

router.delete("/:pid", ProductController.deleteProductController);

export default router;
