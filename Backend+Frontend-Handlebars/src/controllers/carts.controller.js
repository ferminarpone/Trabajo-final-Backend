import jwt from "jsonwebtoken";
import {
  cartService,
  productService,
  ticketService,
} from "../services/service.js";
import ProductsServices from "../services/dbManager/dao/Products.services.js";

export const createCartController = async (req, res) => {
  const { cart } = req.body;
  try {
    await cartService.createCart(cart);
    res.status(200).json({
      mensaje: "El carrito fue agregado exitosamente.",
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

export const getCartByIdController = async (req, res) => {
  const { cid } = req.params;
  try {
    const carrito = await cartService.getCartById(cid, "products.productId");
    const productsCart = carrito.products;
    if (productsCart.length > 0) {
      res.status(200).json({
        productList: productsCart,
      });
    } else {
      res.status(404).json({
        productList: "El carrito se encuentra vacio.",
      });
    }
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

export const addProductInCartController = async (req, res) => {
  const { cid, pid } = req.params;
  let user = jwt.verify(req.cookies.jwtCookieToken, "EcommerceSecretKeyJWT");
  try {
    const response = await cartService.addProductInCart(cid, pid, user.user);
    res.status(200).json({
      mensaje: `El producto con id ${pid} fue agregado exitosamente al carrito con id ${cid}`,
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

export const deleteProductInCartController = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const response = await cartService.deleteProductInCart(cid, pid);
    res.status(200).json({
      mensaje: `El producto con id ${pid} fue eliminado exitosamente al carrito con id ${cid}`,
      response,
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

export const updateCartController = async (req, res) => {
  const { cid } = req.params;
  const updateProducts = req.body;
  try {
    const response = await cartService.updateCart(cid, updateProducts);
    res.json({
      mensaje: `El carrito con id ${cid} fue actualizado exitosamente`,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
};

export const updateQuantityController = async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body;
  try {
    const response = await cartService.updateQuantity(cid, pid, quantity);
    res.json({
      mensaje: `La cantidad del producto con id ${pid} en el carrito con id ${cid} fue actualizada exitosamente`,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
};

export const deleteProductsInCartController = async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartService.deleteProducts(cid);
    res.json({
      mensaje: `El carrito con id ${cid} ha sido vaciado con exito`,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
};

export const createPurchaseController = async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartService.createPurchase(cid);
    res.json({
      mensaje: `Tu compra se ha generado con exito`,
      purchase: response,
    });
  } catch (e) {
    if (e.message != "Stock insuficiente") {
      res.status(500).json({
        error: e.message,
      });
    } else {
      res.status(404).json({
        error: e.message,
      });
    }
  }
};

export const getTicketController = async (req, res) => {
  const { tid } = req.params;
  try {
    const ticket = await ticketService.getTicketById(tid);
    res.json({
      ticket: ticket,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

export const deleteTicketController = async (req, res) => {
  const { tid } = req.params;
  try {
    const ticket = await ticketService.getTicketById({ _id: tid });
    console.log(ticket);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    const deleteTicket = await ticketService.deleteTicketById({ _id: tid });
    if (
      deleteTicket &&
      deleteTicket.products &&
      Array.isArray(deleteTicket.products)
    ) {
      for (const product of deleteTicket.products) {
        const update = await ProductsServices.updateProduct(
          product.updatedProduct._id,
          { stock: product.updatedProduct.stock }
        );
      }
    }
    res.send({ ticketDeleted: deleteTicket });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};
