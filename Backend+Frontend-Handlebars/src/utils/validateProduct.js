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
    const stock = product.stock;
    if (stock == 0)
      throw Error(`Stock insuficiente`);
    /*     if (stock > 0) {
      const stock = product.stock - 1;
        await ProductServices.updateProduct(pid ,{ stock: stock });
    } else {
      throw Error(`Stock insuficiente del producto con id ${pid}`);
    } */
  } catch (e) {
    return res.status(404).json({
      error: e.message,
    });
  }
  next();
};
