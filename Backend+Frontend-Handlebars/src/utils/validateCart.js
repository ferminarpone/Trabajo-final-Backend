import CartDao from "../services/dbManager/dao/carts.services.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { IdCartErrorInfo, nullIdCartErrorInfo } from "../services/errors/messages/cart-creation-error.message.js";

export const validateCart = async (req, res, next) => {
  const { cid } = req.params;
  if (!cid || cid == null || cid == " ") {
    CustomError.createError({
      name: "Cart Validate Error",
      cause: nullIdCartErrorInfo(req, cid),
      message:
        "El Id del carrito es requerido para continuar.",
      code: EErrors.INVALID_TYPES_ERROR,
    });
  }
  try {
    const response = await CartDao.getCartById(cid);
    if (!response) {
      CustomError.createError({
        name: "Cart Validate Error",
        cause: IdCartErrorInfo(req, cid),
        message:
        `No existe el carrito con id ${cid}`,
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
  } catch (e) {
    return res.status(400).json({
      error: e.message,
    });
  }
  next();
};
