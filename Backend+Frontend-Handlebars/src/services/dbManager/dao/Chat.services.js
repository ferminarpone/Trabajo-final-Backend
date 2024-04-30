import { chatModel } from "../models/chat.model.js";

class ChatServices {
  async getAllMessages() {
    return await chatModel.find();
  }

  async saveMessage(message) {
    return await chatModel.create(message);
  }
}

export default new ChatServices();
