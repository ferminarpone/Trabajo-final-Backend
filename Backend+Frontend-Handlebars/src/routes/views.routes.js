import { Router } from "express";
import { __dirname, authorization, passportCall } from "../utils.js";
import {
  cartViewController,
  productsViewController,
} from "../controllers/views.controller.js";

const router = Router();

router.get("/", passportCall("jwt"), productsViewController);

router.get(
  "/realtimeproducts",
  passportCall("jwt"),
  authorization("Admin","Premium"),
  (req, res) => {
    res.render("realtimeproducts.hbs", {
      title: "Ingresar productos",
      fileCss: "styles.css",
    });
  }
);

router.get("/chat", passportCall("jwt"), authorization("User"), (req, res) => {
  res.render("chat.hbs", {
    title: "Chat",  
    fileCss: "styles.css",
  });
});

router.get("/cart", passportCall("jwt"), cartViewController);

export default router;
