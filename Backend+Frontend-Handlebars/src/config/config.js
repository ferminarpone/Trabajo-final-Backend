import dotenv from "dotenv";
import program from "../process.js";
import { config, v2 } from "cloudinary";

const environment = program.opts().mode;
const test = program.opts().test;

dotenv.config({
  path:
    test === true
      ? "./src/config/.env.test"
      : environment === "prod"
      ? "./src/config/.env.production"
      : "./src/config/.env.development",
});

export default {
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
  password: process.env.PASSWORD,
  gmailAccount: process.env.GMAIL_ACCOUNT,
  gmailAppPassword: process.env.GMAIL_APP_PASSWD,
  environment: environment,
  stripeSecretKey: process.env.STRIPE_APP_SECRET_KEY,
};

const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  next();
};

export { cloudinaryConfig, v2 }