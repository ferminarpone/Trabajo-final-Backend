import nodemailer from "nodemailer";
import config from "../config/config.js";
import {
  passwordService,
  ticketService,
  userServices,
} from "../services/service.js";
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
  const { tid } = req.query;
  try {
    const ticket = await ticketService.getTicketById({ _id: tid });
    const user = await userServices.getUser({ email: ticket.purchaser });
    const data = {
      code: ticket.code,
      purchase_datetime: new Date(ticket.purchase_datetime),
      amount: ticket.amount,
      productList: ticket.products
        .map((product) => {
          return `<li> ${product.updatedProduct.title} - $${product.updatedProduct.price}</li>`;
        })
        .join(""),
    };
    const mailOptions = {
      from: "Ecommerce Coderhouse" + config.gmailAccount,
      to: user.email,
      subject: "Compra Exitosa!",
      html: `<div><h1> Gracias por realizar su compra ${user.first_name}!! </h1>
    <h2><u>Detalles:</u></h2>
    <h3>Productos: </h3>
    <ul>${data.productList}</ul>
    <h3>Información adicional: </h3>
    <ul>
    <li>Fecha: ${data.purchase_datetime} </li>
    <li>Codigo de compra: ${data.code} </li>
    <li>Precio Final: $${data.amount} </li>
    </ul>
    </div>`,
      attachments: [],
    };
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
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send("No se ingreso el email");
    }
    const user = await userServices.getUser({ email });
    if (!user) {
      return res.status(404).send("No user");
    }
    const token = v4();
    const link = `http://localhost:8080/api/settings/reset-password/${token}`;
    const pswInfo = {
      token,
      email,
      expirationTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    };
    passwordService.createPswInfo(pswInfo);
    mailResetPswOptions.to = email;
    mailResetPswOptions.html = `Para resetear su contraseña haga click en el siguiente enlace: <a href="${link}"> Reset password</a>`;
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
