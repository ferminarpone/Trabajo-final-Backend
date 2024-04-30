import { logger } from "../../../config/logger-custom.js";

export const nullIdCartErrorInfo = (req, cid) => {
    req.logger.error(`
      El Id ingresado no corresponde a ningun carrito de la DB.
          Propied requerida:
  
              -> Id recibido: ${cid}.
      `);
  };

  export const IdCartErrorInfo = (req, cid) => {
    req.logger.error(`
      El Id ingresado no corresponde a ningun carrito de la DB.
          Propied requerida:
  
              -> Id recibido: ${cid}.
      `);
  };

  export const addProductErrorInfo = (pid,) => {
    logger.error(`
      El Id del producto ingresado corresponde a un producto propio, no es posible ingresarlo al carrito.
          Propied requerida:
  
              -> Id recibido: ${pid}.
      `);
  };