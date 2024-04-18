import passport from "passport";
import UsersDto from "../services/dto/users.dto.js";
import { generateJWTToken, isValidPassword } from "../utils.js";
import { userServices } from "../services/service.js";
import jwt from "jsonwebtoken";
import { v2 } from "../config/config.js";
import { dataUri } from "../utils.js";
import { set } from "mongoose";

//Register
export const jwtRegisterController = (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (!user) {
      console.log("usuario existente" + info.message);
      return res.status(409).json({ message: info.message });
    }
    res
      .status(201)
      .send({ status: "success", message: "Usuario creado con exito.", user });
  })(req, res, next);
};

//Login
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userServices.getUser({ email: email });
    if (!user) {
      req.logger.warning("No existe ningun usuario con email: " + email);
      return res.status(404).send({
        error: "Not found",
        message: "No existe ningun usuario con email: " + email,
      });
    }
    if (!isValidPassword(user, password)) {
      req.logger.warning("Credenciales invalidas para el usuario:" + email);
      return res
        .status(401)
        .send({ status: "error", error: "Credenciales invalidas" });
    }
    const tokenUser = new UsersDto(user);
    const acces_token = generateJWTToken(tokenUser);
    res.cookie("jwtCookieToken", acces_token, {
      maxAge: 360000,
      httpOnly: true,
    }); 
    // Setear Last connection si caduca la cookie.
     setTimeout(async()=>{
      const time = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
      const resp = await userServices.updateUser(user._id, {
          last_connection: time })
    }, 360000) 
    res
      .status(200)
      .json({ message: "Login exitoso", role: `${tokenUser.role}` })

  } catch (error) {
    req.logger.error(error.message);
    return res
      .status(500)
      .send({ status: "error", error: "Error interno de la aplicación." });
  }
};

//Login Github con Jwt
export const loginGithubController = async (req, res) => {};

export const loginGithubCallbackController = async (req, res) => {
  const user = req.user;
  const tokenUser = new UsersDto(user);
  const access_token = generateJWTToken(tokenUser);
  req.logger.info("Acces token: ");
  req.logger.info(access_token);
  res.cookie("jwtCookieToken", access_token, {
    maxAge: 60000,
    httpOnly: true,
  });
  res.redirect("/products");
};

export const logoutController = async (req, res) => {
  const time = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
  const user = jwt.verify(req.cookies.jwtCookieToken, "EcommerceSecretKeyJWT");
  try {
    const resp = await userServices.updateUser(user.user.id, {
      last_connection: time,
    });
    res.clearCookie("jwtCookieToken").send("Session cerrada correctamente"); 
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

export const changeRoleController = async (req, res) => {
  const uid = req.params.uid;
  let user = jwt.verify(req.cookies.jwtCookieToken, "EcommerceSecretKeyJWT");
  if(user.user.role === "Admin"){
    return res.status(401).json({
      error:
        "Usted es Usuario administrador.",
    });
  }
  try {
    if (user.user.role === "Premium") {
      await userServices.updateUser(uid, { role: "User" });
      return res
        .status(200)
        .send({ message: 'Rol modificado a "User" correctamente.' });
    }

    const userInfo = await userServices.getUser({
      _id: uid,
      documents: {
        $all: [
          { $elemMatch: { name: "Identificación" } },
          { $elemMatch: { name: "Domicilio" } },
          { $elemMatch: { name: "Cuenta" } },
        ],
      },
    });

    if (userInfo) {
      await userServices.updateUser(uid, { role: "Premium" });
      return res
        .status(200)
        .send({ message: 'Rol modificado a "Premium" correctamente.' });
    } else {
      return res.status(400).json({
        error:
          "Para ser usuario Premium es necesario completar toda la documentación",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      error: error.message,
    });
  }
};

export const deleteController = async (req, res) => {
  const { uid } = req.params;
  try {
    const response = await userServices.deleteUser({ _id: uid });
    res.status(200).json({
      mensaje: "Usuario eliminado exitosamente",
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

export const documentsController = async (req, res) => {
  const { uid } = req.params;
  const files = req.files[0];
  const documento = req.body.doc;
  if (files) {
    try {
      const file = dataUri(files).content;
      const result = await v2.uploader.upload(file, {
        folder: "Ecommerce/Documents",
      });
      const image = result.url;
      const newDocument = {
        name: documento,
        reference: image,
      };
      const user = await userServices.getUser({ _id: uid });
      let userDocuments = user.documents;
      const findDoc = userDocuments.find((doc) => doc.name === documento);
      if (!findDoc) {
        userDocuments = [...userDocuments, newDocument];
      } else {
        const index = userDocuments.findIndex((doc) => doc.name === documento);
        userDocuments[index] = newDocument;
      }
      await userServices.updateUser(uid, { documents: userDocuments });
      return res.status(200).json({
        messge: "Your documents has been uploded successfully to cloudinary",
      });
    } catch (error) {
      res.status(500).json({
        messge: "someting went wrong while processing your request",
        data: {
          error,
        },
      });
    }
  } else {
    return res.status(400).json({
      message: "No files were provided in the request",
    });
  }
};
