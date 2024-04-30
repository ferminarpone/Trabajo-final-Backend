export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }
  createTicket = (ticket) => {
    return this.dao.createTicket(ticket);
  };

  getLastOneTicket = (email) => {
    return this.dao.getLastOneTicket(email);
  };

  getTicketById = (id) => {
    return this.dao.getTicketById(id)
  };

  deleteTicketById = (id) => {
    return this.dao.deleteTicketById(id)
  }
}
