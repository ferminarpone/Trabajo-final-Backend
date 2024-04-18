import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { IdProductErrorInfo } from "../services/errors/messages/product-creation-error.message.js";
import { productService } from "../services/service.js";

export const getProductsController = async (req, res) => {
  const { limit, page, sort, filter } = req.query;
  try {
    const products = await productService.getAllProducts(
      limit,
      page,
      sort,
      filter
    );
    res.status(200).json({
      products,
    });
  } catch (e) {
    res.status(404).json({
      message: e.message,
    });
  }
};

export const getProductByIdController = async (req, res) => {
  const { pid } = req.params;
  try {
    const productId = await productService.getProductById(pid);
    if (productId == null) {
      CustomError.createError({
        name: "Product Id Error",
        cause: IdProductErrorInfo(pid),
        message: `El producto con id ${pid} no existe`,
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    res.status(200).json(productId);
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

export const createProductController = async (req, res) => {
  try {
    const newProduct = req.body;
    const response = await productService.createProduct(newProduct);
    res.status(200).json({
      mensaje: "El producto fue agregado con exito",
      response
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;
  try {
    const response = await productService.updateProduct(pid, updatedProduct);
    if (response == null) {
      CustomError.createError({
        name: "Product Id Error",
        cause: IdProductErrorInfo(pid),
        message: `El producto con id ${pid} no existe`,
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    res.status(200).json({
      mensaje: "El producto se actualizo exitosamente.",
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  const { pid } = req.params;
  try {
    const response = await productService.deleteProduct(pid);
    if (response == null) {
      CustomError.createError({
        name: "Product Id Error",
        cause: IdProductErrorInfo(pid),
        message: `El producto con id ${pid} no existe`,
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    res.status(200).json({
      mensaje: "Producto eliminado exitosamente",
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};
