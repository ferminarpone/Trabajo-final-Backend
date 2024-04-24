import passport from "passport";
import UsersDto from "../services/dto/users.dto.js";
import CustomUser from "../services/dto/customUser.dto.js";
import { generateJWTToken, isValidPassword } from "../utils.js";
import { userServices } from "../services/service.js";
import jwt from "jsonwebtoken";
import { v2 } from "../config/config.js";
import { dataUri } from "../utils.js";
import { sendEmailToDeletedUser } from "../utils/sendEmail.js";

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
      //maxAge: 6000,
      httpOnly: true,
    });
    // Setear Last connection si caduca la cookie.
    setTimeout(async () => {
      /* const time = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`; */
      const time = new Date(Date.now());
      const resp = await userServices.updateUser(user._id, {
        last_connection: time,
      });
    }, 360000);
    res
      .status(200)
      .json({ message: "Login exitoso", role: `${tokenUser.role}` });
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
    maxAge: 360000,
    httpOnly: true,
  });
  setTimeout(async () => {
    //const time = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
    const time = new Date(Date.now());
    const resp = await userServices.updateUser(user._id, {
      last_connection: time,
    });
  }, 360000);
  res.redirect("/products");
};

export const logoutController = async (req, res) => {
  const time = new Date(Date.now());
  //const time = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
  const user = jwt.verify(req.cookies.jwtCookieToken, "EcommerceSecretKeyJWT");
  try {
    const resp = await userServices.updateUser(user.user.id, {
      last_connection: time,
    });
    res.clearCookie("jwtCookieToken").send("Session cerrada correctamente");
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: error.message,
    });
  }
};

export const changeRoleController = async (req, res) => {
  const uid = req.params.uid;
  let user = jwt.verify(req.cookies.jwtCookieToken, "EcommerceSecretKeyJWT");
  const getUser = await userServices.getUser({ _id: uid });
  if (user.user.role === "Admin") {
    if (getUser.role === "Admin") {
      return res.status(401).json({
        error: "Usted es Usuario administrador.",
      });
    }
  }
  try {
    if (getUser.role === "Premium") {
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

export const getAllUsersController = async (req, res) => {
  try {
    const result = await userServices.getUsers();
    let users = [];
    result.forEach((user) => {
      const customUser = new CustomUser(user);
      users.push(customUser);
    });
    res.send({
      message: "succes",
      payload: users,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const deleteExpiredCountsController = async (req, res) => {
  try {
    const users = await userServices.getUsers();
    const expiredUser = [];
    for (const user of users) {
      const expirationTime =
        user.last_connection +  48 * 60 * 60 * 1000;
      const timeNumber = Date.now();
      if (
        (expirationTime < timeNumber ||
          user.last_connection == null ||
          user.last_connection == undefined) &&
        user.role !== "Admin"
      ) {
        await userServices.deleteUser(user._id);
        sendEmailToDeletedUser(user);
        expiredUser.push(user);
      }
    }
    if (expiredUser.length === 0) {
      return res
        .status(204)
        .send({ message: "Todos los usuarios se encuentran activos" });
    }
    res.status(200).send({
      message: "Usuario inactivos durante 48hs. eliminados exitosamente.",
      expiredUser,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
