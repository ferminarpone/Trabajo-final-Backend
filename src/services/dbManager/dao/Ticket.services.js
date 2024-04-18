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
}

export default new TicketServices();
