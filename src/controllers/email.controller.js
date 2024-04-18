import nodemailer from "nodemailer";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import { passwordService, ticketService, userServices } from "../services/service.js";
import { logger } from "../config/logger-custom.js";
import { v4 } from "uuid";


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

export const sendEmailController = async (req, res) => {
  const user = jwt.verify(req.cookies.jwtCookieToken, "EcommerceSecretKeyJWT");
  const ticket = await ticketService.getLastOneTicket(user.user.email);
  const data = {
    code: ticket[0].code,
    purchase_datetime: new Date(ticket[0].purchase_datetime),
    amount: ticket[0].amount,
  };
  const mailOptions = {
    from: "Ecommerce Coderhouse" + config.gmailAccount,
    to: user.user.email,
    subject: "Compra Exitosa!",
    html: `<div><h1> Gracias por realizar su compra ${user.user.name} </h1>
    <h2>Detalle de tu compra</h2>
    <ul>
    <li>Fecha: ${data.purchase_datetime} </li>
    <li>Codigo de compra: ${data.code} </li>
    <li>Precio Final: $${data.amount} </li>
    </ul>
    </div>`,
    attachments: [],
  };

  try {
    let result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error("Error al enviar el email " + error);
        res.status(400).send({ message: "Error", payload: error });
      }
      logger.info("Message sent: " + info.messageId);
      res.send({ message: "Success", payload: info });
    });
  } catch (error) {
    logger.error("Error al enviar el email " + error);
    res.status(500).send({
      error: error,
      message: "No se pudo enviar el email desde:" + config.gmailAccount,
    });
  }
};

// Password Reset

const mailResetPswOptions = {
  from: "Ecommerce Coderhouse" + config.gmailAccount,
  subject: "Resetear contraseña",
};

export const sendEmailToResetPassController = async (req, res) => {
  // CONDICIONAL, RESET AL OLVIDAR PSW (FORMULARIO), RESET AL CAMBIAR PSW (MAIL DESDE COOKIE)

  //FORMULARIO

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("No se ingreso el email");
    }
    const user = await userServices.getUser({email});
   if(!user){
    return res.status(404).send("No user");
   }
    const token = v4();
    const link = `http://localhost:8080/api/settings/reset-password/${token}`;
    const pswInfo = {
      token,
      email,
      expirationTime: new Date(Date.now() + 1 * 60 * 1000),
    };
    passwordService.createPswInfo(pswInfo);

    mailResetPswOptions.to = email;
    mailResetPswOptions.html = `Para resetear su contraseña haga click en el siguiente enlace: <a href="${link}> Reset password</a>`;
    transporter.sendMail(mailResetPswOptions, (error, info) => {
      if (error) {
        logger.error("Error al enviar el email " + error);
        res.status(400).send({ message: "Error", payload: error });
      }
      logger.info("Message sent: " + info.messageId);
      res.send({ message: "Success", payload: info });
    });
  } catch (error) {
    logger.error("Error al enviar el email " + error);
    res.status(500).send({
      error: error,
      message: "No se pudo enviar el email desde:" + config.gmailAccount,
    });
  }
};
