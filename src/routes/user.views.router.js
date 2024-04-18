import { Router } from "express";
import { passportCall } from "../utils.js";

const router = Router();
router.get("/", (req, res) => {
  res.render("login", {
    fileCss: "styles.css",
  });
});

router.get("/register", (req, res) => {
  res.render("register", {
    fileCss: "styles.css",
  })
});
router.get("/password-reset", (req, res) => {
  res.render("emailPassword", {
    fileCss: "styles.css",
  })
});
router.get("/api/settings/reset-password/:token", (req, res) => {
  res.render("resetPassword", {
    fileCss: "styles.css",
  })
});
// Renderización del perfil del usuario, pasar a /products
router.get(
  "/users",
  // passport.authenticate('jwt', { session: false })
  passportCall("jwt"),
  /*  authorization('user'), */
  (req, res) => {
    res.render("profile", {
      user: req.user,
      fileCss: "styles.css",
    });
  }
);

export default router;
