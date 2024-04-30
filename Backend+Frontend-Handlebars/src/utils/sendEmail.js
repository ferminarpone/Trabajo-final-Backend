import nodemailer from "nodemailer";
import config from "../config/config.js";
import { logger } from "../config/logger-custom.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmailAccount,
    pass: config.gmailAppPassword,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    logger.error(error);
  } else {
    logger.info("Server is ready to take our messages");
  }
});

// Expired User
const expiredUserOptions = {
  from: "Ecommerce Coderhouse" + config.gmailAccount,
  subject: "Su usuario ha expirado.",
};

export const sendEmailToDeletedUser = (user) => {
  try {
    if (!user.email) {
      throw Error("Usuario sin email");
    }
    expiredUserOptions.to = user.email;
    expiredUserOptions.html = `
      <div>
      <h3>Hola ${user.first_name}! </h3>
      <p>Su usuario ha expirado por no haber sido utilizado en las ultimas 48 horas.</p>
      </br>
      <p> Vuelva a crear un usuario para seguir navegando!</p>
      </br>
      <a href="http://localhost:8080/register">Registrar usuario</a>
      </br>
      <p>Muchas gracias.</p>
      </div>`;
    transporter.sendMail(expiredUserOptions, (error, info) => {
      if (error) {
        logger.error("Error al enviar el email " + error);
        throw Error({ message: "Error", payload: error });
      }
      logger.info("Message sent: " + info.messageId);
    });
  } catch (error) {
    logger.error("Error al enviar el email " + error);
    throw Error({
      error: error,
      message: "No se pudo enviar el email desde:" + config.gmailAccount,
    });
  }
};


// Deleted user premiun product

const deletedProductOptions = {
  from: "Ecommerce Coderhouse" + config.gmailAccount,
  subject: "Producto eliminado",
};

export const sendEmailForDeletedProduct = (user, prod) => {
  try {
    if (!user.email) {
      throw Error("Usuario sin email");
    }
    deletedProductOptions.to = user.email;
    deletedProductOptions.html = `
      <div>
      <h3>Hola ${user.first_name}! </h3>
      <p><strong>Importante!</strong></p>
      </br>
      <p>Su producto <strong>"${prod.title}"</strong> con Id <strong>${prod._id}</strong> ha sido eliminado.</p>
      </br>
      
      <a href="http://localhost:8080">Volver a iniciar sesión</a>
      </br>
      <p>Muchas gracias.</p>
      </div>`;
    transporter.sendMail(deletedProductOptions, (error, info) => {
      if (error) {
        logger.error("Error al enviar el email " + error);
        throw Error({ message: "Error", payload: error });
      }
      logger.info("Message sent: " + info.messageId);
    });
  } catch (error) {
    logger.error("Error al enviar el email " + error);
    throw Error({
      error: error,
      message: "No se pudo enviar el email desde:" + config.gmailAccount,
    });
  }
};
