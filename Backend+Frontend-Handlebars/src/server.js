import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { initSocketServer } from "./socket/socket.js";
import usersViewRouter from "./routes/user.views.router.js";
import emailRouter from "./routes/email.router.js";
import paymentRouter from "./routes/payments.router.js";
import mockingRouter from "./routes/mocking.router.js";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import settingsRouter from "./routes/settings.router.js";
import jwtRouter from "./routes/users.router.js";
import githubLoginViewRouter from "./routes/github-login.views.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import config, { cloudinaryConfig } from "./config/config.js";
import program from "./process.js";
import MongoSingleton from "./config/mongoDb-singleton.js";
import { addLogger, logger } from "./config/logger-custom.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";
import cors from 'cors';

const PORT = program.opts().p === 8080 ? config.port : program.opts().p;

const app = express();
const httpServer = app.listen(PORT, () =>
  logger.info(`Server listening on port ${PORT}`)
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addLogger);
app.use(cors());

// Configuraciób web socket
initSocketServer(httpServer);

// Configuracion MongoSingleton
const mongoInstance = async () => {
  try {
    await MongoSingleton.getInstance();
  } catch (error) {
    logger.error(error.message);
  }
};
mongoInstance();

//Configuración de passport
initializePassport();
app.use(passport.initialize());

app.use((req, res, next) => {
  req.authInfo = req.info || {};
  if (req.authInfo instanceof Error) {
    req.authInfo = { message: req.authInfo.message };
  }
  next();
});

//Cookies
app.use(cookieParser("EcommerceS3cr3tC0d3"));

// Configuración engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
// Seteando motor de plantillas
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

// Public
app.use(express.static(`${__dirname}/../public`));

// Multer - Cloudinary
app.use("*", cloudinaryConfig);

// Routes de productos y carritos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/products", viewsRouter);

//Routes de usuarios
//JWT
app.use("/api/users", jwtRouter);
app.use("/", usersViewRouter);
//Routes login gitHub
app.use("/github", githubLoginViewRouter);

//Routes de mailing
app.use("/api/email", emailRouter);

//Route Mocking
app.use("/mockingproducts", mockingRouter);

//Route Settings
app.use("/api/settings", settingsRouter);

//Route Stripe - pasarel de pago
app.use("/api/payments", paymentRouter);

//Route Logger Test
app.get("/loggerTest", (req, res) => {
  req.logger.fatal("Prueba de log level fatal --> en Endpoint");
  req.logger.error("Prueba de log level error --> en Endpoint");
  req.logger.warning("Prueba de log level warning --> en Endpoint");
  req.logger.info("Prueba de log level info --> en Endpoint");
  req.logger.http("Prueba de log level http --> en Endpoint");
  req.logger.debug("Prueba de log level debug --> en Endpoint");

  res.send("Prueba de logger!");
});

//Documentación Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación API Ecommerce",
      description: "Documentación de aplicación Ecommerce, trabajo CoderHouse.",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJsDoc(swaggerOptions);
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));
