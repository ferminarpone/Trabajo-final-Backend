import { cartService } from "../services/service.js";

export const stockValidate = async (req, res, next) => {
  const { cid } = req.params;
  try {
    const cart = await cartService.getCartById(cid);
  } catch (e) {
    return res.json({
      error: e.message,
    });
  }
  next();
};
