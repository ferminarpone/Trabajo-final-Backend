export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAllCarts = () => {
    return this.dao.getAllCarts();
  };
  getCartById = (id, products) => {
    return this.dao.getCartById(id, products);
  };
  createCart = (cart) => {
    return this.dao.createCart(cart);
  };
  addProductInCart = (cid, pid, role) => {
    return this.dao.addProductInCart(cid, pid, role);
  };
  deleteProductInCart = (cid, pid) => {
    return this.dao.deleteProductInCart(cid, pid);
  };
  updateCart = (cid, updateProducts) => {
    return this.dao.updateCart(cid, updateProducts);
  };
  updateQuantity = (cid, pid, quantity) => {
    return this.dao.updateQuantity(cid, pid, quantity);
  };
  deleteProducts = (cid) => {
    return this.dao.deleteProducts(cid);
  };
  createPurchase = (cid) => {
    return this.dao.createPurchase(cid);
  };
}
