import passport from "passport";
import passportLocal from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { PRIVATE_KEY, createHash } from "../utils.js";
import { cartService, userServices } from "../services/service.js";
import { logger } from "./logger-custom.js";

//Declaración de estrategia
const localStrategy = passportLocal.Strategy;
const JwtStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  //Register
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const exist = await userServices.getUser({ email: username })
          if (exist) {
            return done(null, false, { message: 'El correo electrónico ya está en uso' } );
          }
          const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            loggedBy: "Registro Local",
          };
          email === "adminCoder@coder.com" || email === "fermin@gmail.com"
            ? (user.role = "Admin")
            : (user.role = "User");
            const cart = await cartService.createCart();
            user.cart = cart._id;
          const newUser = await userServices.createUser(user);
          return done(null, newUser);
        } catch (error) {
          req.logger.error("Error registrando al usuario " + error);
          return done("Error registrando al usuario " + error);
        }
      }
    )
  );

  //Login con Github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.9b96bb06921fd9d6",
        clientSecret: "79982a709b54f8006b6f218faac8a09f3c24129a",
        callbackUrl: "http://localhost:8080/api/users/githubcallback",
      },
      async (accesToken, refreshToken, profile, done) => {
        logger.info("Profile obtenido del usuario de GitHub");
        logger.info(profile._json);
        try {
          const email =
            profile._json.email === null
              ? profile._json.html_url
              : profile._json.email;
          const user = await userServices.getUser({ email: email });
          if (user) return done(null, user);
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: 28,
            email:
              profile._json.email === null
                ? profile._json.html_url
                : profile._json.email,
            password: "",
            loggedBy: "GitHub",
          };
          const cart = await cartService.createCart();
          newUser.cart = cart._id;
          const result = await userServices.createUser(newUser);
          return done(null, result);
        } catch (error) {
          logger.error("Error al intentar loggearse mediante GitHub"+ error.message)
          return done(error);
        }
      }
    )
  );

  //JWT STRATEGY
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          logger.error("Error de login "+ error.message)
          return done(error);
        }
      }
    )
  );

  //Serialización y Deserialización
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userServices.getUserById(id);
      done(null, user);
    } catch (error) {
      logger.error("Error deserializando el usuario: " + error);
    }
  });

};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwtCookieToken"];
  }
  return token;
};

export default initializePassport;
