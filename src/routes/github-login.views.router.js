import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.render("github-login");
});

router.get("/error", (req, res) => {
  res.render("github-error", { error: "No se pudo autenticar usando GitHub!" });
});

export default router;
