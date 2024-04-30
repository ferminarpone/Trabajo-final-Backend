import { Server } from "socket.io";
import ChatServices from "../services/dbManager/dao/chat.services.js";
import ProductServices from "../services/dbManager/dao/products.services.js";
import jwt from "jsonwebtoken";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { deleteProductErrorInfo } from "../services/errors/messages/product-creation-error.message.js";
import { sendEmailForDeletedProduct } from "../utils/sendEmail.js";
import { userServices } from "../services/service.js";

const initSocketServer = (server) => {
  const socketServer = new Server(server);
  socketServer.on("connection", async (socketCliente) => {
    socketCliente.on("form_information", async (data) => {
    const cookies = socketCliente.request.headers.cookie.split(";");
    const jwtCookie = cookies.find(cookie => cookie.includes('jwtCookieToken='));
    const jwtCookieToken = jwtCookie.split('=')
    let user = jwt.verify(jwtCookieToken[1], "EcommerceSecretKeyJWT");    
     try {
        if (user.user.role === "Premium") {
          data.owner = user.user.email;
        }

        await ProductServices.createProduct(data);
        const prod = await ProductServices.getAllProducts();
        socketCliente.emit("products_list", prod.payload);
      } catch (e) {
        if (e.message.includes("required")) {
          return socketCliente.emit(
            "products_list",
            "Para agregar un nuevo producto, es necesario ingresar todos los campos requeridos."
          );
        }
        socketCliente.emit("products_list", e.message);
      } 
    });

    socketCliente.on("product_delete", async (data) => {
      const cookies = socketCliente.request.headers.cookie.split(";");
      const jwtCookie = cookies.find(cookie => cookie.includes('jwtCookieToken='));
      const jwtCookieToken = jwtCookie.split('=')
      let user = jwt.verify(jwtCookieToken[1], "EcommerceSecretKeyJWT");
      const productOwner = await userServices.getUser({ email: data.owner });
      try {
        if (user.user.role === "Premium" && data.owner !== user.user.email) {
          CustomError.createError({
            name: "Delete product error",
            cause: deleteProductErrorInfo(),
            message: "Solo puedes eliminar productos propios.",
            code: EErrors.INVALID_TYPES_ERROR,
          });
        }
        await ProductServices.deleteProduct(data._id);
        if (data.owner !== "admin") {
          sendEmailForDeletedProduct(productOwner, data);
        }
        const prod = await ProductServices.getAllProducts();
        socketCliente.emit("products_list", prod.payload);
      } catch (e) {
        socketCliente.emit("products_list", { error: e.message });
      }
    });
    const prod = await ProductServices.getAllProducts();
    socketCliente.emit("products_list", prod.payload);

    //Socket chat
    socketCliente.on("chat_information", async (data) => {
      try {
        await ChatServices.saveMessage(data);
        const messages = await ChatServices.getAllMessages();
        socketServer.emit("chat_allMessages", messages);
      } catch (e) {
        if (e.message.includes("required")) {
          return socketCliente.emit(
            "chat_allMessages",
            "Para comenzar es necesario ingresar todos los campos requeridos."
          );
        }
        socketCliente.emit("chat_allMessages", { error: e.message });
      }
    });
    const messages = await ChatServices.getAllMessages();
    socketCliente.emit("chat_allMessages", messages);
  });
};
export { initSocketServer };
