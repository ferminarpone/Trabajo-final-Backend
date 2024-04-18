import { Router } from "express";
import passport from "passport";
import { validateUser } from "../utils/validateUser.js";
import * as userController from "../controllers/users.controller.js";
import { multerUploads } from "../utils.js";

const router = Router();

//Register
router.post("/register", validateUser, userController.jwtRegisterController);

//Login
router.post("/login", userController.loginController);

//Login Github con Jwt
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  userController.loginGithubController
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "github/error",
  }),
  userController.loginGithubCallbackController
);

//Logout
router.get("/logout", userController.logoutController);

// Cambio de Roles
router.post("/premium/:uid", userController.changeRoleController);

//Eliminar usuario
router.delete("/delete/:uid", userController.deleteController);

//Subir archivos
router.post(
  "/:uid/documents",
  multerUploads.array("file"),
  userController.documentsController
);  


export default router;
