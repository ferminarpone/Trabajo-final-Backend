import ProductServices from "../services/dbManager/dao/products.services.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { IdProductErrorInfo } from "../services/errors/messages/product-creation-error.message.js";

export const validateProduct = async (req, res, next) => {
  const { pid } = req.params;
  if (!pid || pid == null || pid == " ") {
    return res.json({
      erorr: `El pid es requerido `,
    });
  }
  try {
    const product = await ProductServices.getProductById(pid);
    if (!product) {
      CustomError.createError({
        name: "Product Id Error",
        cause: IdProductErrorInfo(req, pid),
        message: `El producto con id ${pid} no existe`,
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const stock = product.stock;
    if (stock == 0) throw Error(`Stock insuficiente`);
  } catch (e) {
    return res.status(404).json({
      error: e.message,
    });
  }
  next();
};
