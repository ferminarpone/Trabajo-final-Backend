import { userModel } from "../models/user.model.js";

class UserServices {

  async getUsers() {
    return await userModel.find();
  }

  async getUser(condition) {
    return await userModel.findOne(condition);
  }

  async getUserById(id, cart) {
    return await userModel.findById(id).populate(cart);
  }

  async createUser(user) {
    return await userModel.create(user);
  }

  async updateUser(id, user) {
    return await userModel.findByIdAndUpdate(id, user)
  }

  async deleteUser(id){
    return await userModel.deleteOne(id)
  }
}

export default new UserServices();
