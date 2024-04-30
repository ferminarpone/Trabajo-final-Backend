import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { faker } from "@faker-js/faker/locale/es";
import multer from "multer";
import Datauri from "datauri/parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export { __dirname };

//Generación del Hash
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Validación del Hash
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

//JSON Web Tokens (JWT)
export const PRIVATE_KEY = "EcommerceSecretKeyJWT";
export const generateJWTToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
};

//authToken
export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return res
      .status(401)
      .send({ error: "Usuario no autenticado o error de token" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error)
      return res.status(403).send({ error: "Token invalido, no autorizado" });
    req.user = credentials.user;
    next();
  });
};

//PassportCall manejo de errores
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.render("expired.hbs");
        /*.status(401)
          .send({ error: info.messages ? info.messages : info.toString() }); */
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

// Manejor de autorizacion
export const authorization = (role1, role2) => {
  return async (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .send("Usuario no autorizado: Usuario no encontrado en JWT");
    if (req.user.role === role1 || req.user.role === role2) {
      next();
    } else {
      return res
        .status(403)
        .send("Forbidden: El usuario no tiene permisos con este rol.");
    }
  };
};

// Mocking
export const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.commerce.isbn(),
    price: parseFloat(faker.commerce.price()),
    status: true,
    stock: parseFloat(faker.string.numeric()),
    category: faker.commerce.department(),
    thumbnail: faker.image.url(),
  };
};

//Multer and Cloudinary config

const storage = multer.memoryStorage();

const multerUploads = multer({
  storage,
  // si se genera algun error, lo capturamos
  onError: function (err, next) {
    console.log(err);
    next();
  },
});
const dUri = new Datauri();
const dataUri = (files) => {
  return dUri.format(path.extname(files.originalname).toString(), files.buffer);
};

export { multerUploads, dataUri };
