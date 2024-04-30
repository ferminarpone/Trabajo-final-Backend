import cartsServices from "./dbManager/dao/carts.services.js";
import PasswordServices from "./dbManager/dao/Password.services.js";
import productsServices from "./dbManager/dao/Products.services.js";
import TicketServices from "./dbManager/dao/Ticket.services.js";
import UserServices from "./dbManager/dao/User.services.js";
import CartsRepository from "./repository/carts.repository.js";
import PasswordRepository from "./repository/password.repository.js";
import ProductsRepository from "./repository/products.repository.js";
import TicketRepository from "./repository/ticket.repository.js";
import UsersRepository from "./repository/users.repository.js";


export const productService = new ProductsRepository(productsServices);
export const cartService = new CartsRepository(cartsServices);
export const ticketService = new TicketRepository(TicketServices);
export const passwordService = new PasswordRepository(PasswordServices)
export const userServices = new UsersRepository(UserServices)