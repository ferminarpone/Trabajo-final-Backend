import { id_ID } from "@faker-js/faker";

export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }
  
  getUsers = () => {
    return this.dao.getUsers();
  };

  getUser = (condition) => {
    return this.dao.getUser(condition);
  };

  getUserById = (id, cart) => {
    return this.dao.getUserById(id, cart);
  };

  createUser = (user) => {
    return this.dao.createUser(user);
  };

  updateUser = (id, user) => {
    return this.dao.updateUser(id, user);
  };

  deleteUser = (id) => {
    return this.dao.deleteUser(id)
  }
}
