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
}
