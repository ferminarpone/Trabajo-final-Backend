import cartsDao from "../services/dbManager/dao/carts.services.js";
import ProductServices from "../services/dbManager/dao/products.services.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { IdProductErrorInfo } from "../services/errors/messages/product-creation-error.message.js";

export const validateProdDel = async (req, res, next) => {
  const { pid, cid } = req.params;
  if (!pid || pid == null || pid == " ") {
    return res.json({
      erorr: `El pid es requerido `,
    });
  }
  try {
    const product = await ProductServices.getProductById(pid);
    if (!product) {
/*       return res.json({
        error: `No existe el producto con id ${pid}`,
      }); */
      CustomError.createError({
        name: "Product Id Error",
        cause: IdProductErrorInfo(req, pid),
        message:
        `El producto con id ${pid} no existe`,
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const cart = await cartsDao.getCartById(cid);
    const productInCart = cart.products.find((prod) => prod.productId == pid);
    if (productInCart === undefined) {
      return res.json({
        error: `No existe el producto con id ${pid} dentro del carrito con id ${cid}`,
      });
    }
  } catch (e) {
    return res.status(400).json({
      error: e.message,
    });
  }
  next();
};
