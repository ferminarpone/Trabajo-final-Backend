import CustomUser from "../services/dto/customUser.dto.js";
import { cartService, productService, userServices } from "../services/service.js";

export const productsViewController = async (req, res) => {
  const { limit, page, sort, filter } = req.query;
  try {
    const products = await productService.getAllProducts(
      limit,
      page,
      sort,
      filter
    );
    const renderProducts = products.payload;

    const documents = req.user.documents.length > 0 ? req.user.documents : null;

    res.render("home", {
      title: "Productos",
      renderProducts,
      products,
      fileCss: "styles.css",
      user: req.user,
      documents,
    });
  } catch (e) {
    req.logger.error(e.message);
    res.render("home", {
      error: e.message,
    });
  }
};

export const cartViewController = async (req, res) => {
  try {
    const cid = req.user.cart;
    const cart = await cartService.getCartById(cid, "products.productId");
    const newCart = renderCart(cart);
    const totalAmount = newCart.reduce((acc, el) => {
      return acc + el.amount;
    }, 0);
    res.render("cart.hbs", {
      title: "Cart",
      fileCss: "styles.css",
      user: req.user,
      cart: newCart,
      totalAmount,
      idCart: newCart.length != 0 ? newCart[0].idCart : null,
    });
  } catch (e) {
    req.logger.error(e.message);
    res.render("cart", {
      error: e.message,
    });
  }
};

const renderCart = (cart) => {
  let newCart = [];
  cart.products.forEach((el) => {
    const product = {
      prodId: el.productId._id,
      thumbnail: el.productId.thumbnail,
      description: el.productId.description,
      category: el.productId.category,
      price: el.productId.price,
      code: el.productId.code,
      stock: el.productId.stock,
      quantity: el.quantity,
      amount: el.productId.price * el.quantity,
      id: cart._id,
    };
    newCart.push(product);
  });
  return newCart;
};


export const usersManagerViewsController = async (req, res) => {
  try {
    const result = await userServices.getUsers();
    let users = [];
    result.forEach(user => {
      const customUser = new CustomUser(user)
      users.push(customUser);
    });
    res.render("users", {
      users,
      fileCss: "styles.css"
    })
  } catch (error) {
    req.logger.error(error.message);
    res.render("home", {
      error: error.message,
    });
  }

}

