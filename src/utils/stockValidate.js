import { cartService } from "../services/service.js";


export const stockValidate = async (req, res, next) =>{
    const { cid } = req.params;
    try {
      const cart = await cartService.getCartById(cid);
    /*  const stock = product.stock;
         if (stock > 0) {
        const stock = product.stock - 1;
          await ProductServices.updateProduct(pid ,{ stock: stock });
      } else {
        throw Error(`Stock insuficiente del producto con id ${pid}`);
      }  */
    } catch (e) {
      return res.json({
        error: e.message,
      });
    }
    next(); 
}