import { ticketModel } from "../models/ticket.model.js";

class TicketServices {
  async createTicket(ticket) {
    return await ticketModel.create(ticket);
  }

  async getLastOneTicket(email) {
    return await ticketModel
      .find({ purchaser: email })
      .sort({ purchase_datetime: -1 });
  }

  async getTicketById(id) {
    return await ticketModel.findOne({_id:id})
  }

  async deleteTicketById(id) {
    return await ticketModel.findByIdAndDelete(id)
  }
}

export default new TicketServices();
