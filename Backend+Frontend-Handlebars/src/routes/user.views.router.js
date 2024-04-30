import { Router } from "express";
import { authorization, passportCall } from "../utils.js";
import { usersManagerViewsController } from "../controllers/views.controller.js";

const router = Router();
router.get("/", (req, res) => {
  res.render("login", {
    fileCss: "styles.css",
  });
});

router.get("/register", (req, res) => {
  res.render("register", {
    fileCss: "styles.css",
  });
});
router.get("/password-reset", (req, res) => {
  res.render("emailPassword", {
    fileCss: "styles.css",
  });
});
router.get("/api/settings/reset-password/:token", (req, res) => {
  res.render("resetPassword", {
    fileCss: "styles.css",
  });
});

router.get("/users", passportCall("jwt"), (req, res) => {
  res.render("profile", {
    user: req.user,
    fileCss: "styles.css",
  });
});

router.get(
  "/users-manager",
  passportCall("jwt"),
  authorization("Admin"),
  usersManagerViewsController
);

export default router;
