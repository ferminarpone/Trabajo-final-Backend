import fs from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
    try {
      let carts = fs.readFileSync(path, "utf-8");
      this.carts = JSON.parse(carts);
    } catch {
      this.carts = [];
    }
  }
  //Función que devuelve todos carritos que se encuentran en el manejador.
  getCarts() {
    return this.carts;
  }
  //Función que agrega carritos al arreglo de carritos inicial.
  async addCart(cart) {
    cart.id =
      this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
    this.carts.push(cart);
    const save = await this.saveFile(this.carts);
    if (save) {
      console.log(`El carrito con id ${cart.id} fue agregado exitosamente.`);
      return true;
    }
    throw Error("Se genero un error al agregar el carrito.");
  }

  //Función que busca el carrito por "Id" en la lista de carritos.
  getCartById(idCart) {
    const fetch = this.carts.find((el) => el.id === idCart);
    if (!fetch) {
      throw Error(`No existe ningun carrito con id: ${idCart}`);
    } else {
      return fetch;
    }
  }

  //Función que agrega un producto a un carrito especificado por Id.
  async addProductCart(cartId, productId) {
    const cart = this.carts.find((el) => el.id === cartId);
    const searchProductCart = cart.products.find(
      (prod) => prod.id === productId
    );
    if (!searchProductCart) {
      cart.products = [...cart.products, { id: productId, quantity: 1 }];
    } else {
      cart.products.map((prod) => {
        if (prod.id === productId) {
          prod.quantity = prod.quantity + 1;
        }
      });
    }

    //Remplazo el objeto del carrito, por el nuevo objeto y luego lo guardo en el archivo json.
    const indexCart = this.carts.findIndex((cart) => cart.id === cartId);
    this.carts[indexCart] = cart;
    const save = await this.saveFile(this.carts);
    if (!save) {
      throw Error("Se genero un error al agregar el producto al carrito.");
    }
  }
  
  //Función que guarda el nuevo array de carritos en un archivo json.
  async saveFile(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
      return true;
    } catch (error) {
      return false;
    }
  }
}
