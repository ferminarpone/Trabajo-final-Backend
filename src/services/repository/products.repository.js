export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAllProducts = (limit, page, sort, filter) => {
    return this.dao.getAllProducts(limit, page, sort, filter);
  };
  getProductById = (id) => {
    return this.dao.getProductById(id);
  };
  createProduct = (product) => {
    return this.dao.createProduct(product);
  };
  updateProduct = (id, product) => {
    return this.dao.updateProduct(id, product);
  };
  deleteProduct = (id) => {
    return this.dao.deleteProduct(id);
  };
  deleteAllProducts = () =>{
    return this.dao.deleteAllProducts();
  }
}
