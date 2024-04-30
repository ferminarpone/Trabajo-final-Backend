import PaymentService from "../services/payments/paymentsService.js";
import { ticketService } from "../services/service.js";


export const paymentsController = async (req, res) => {
  console.log(`Ticket id: ${req.query.tid}`);
  try {
    const ticket = await ticketService.getTicketById({ _id: req.query.tid });
    // Creamos un obj de pago
    const paymentIntentInfo = {
      amount: ticket.amount,
      currency: "usd",
      metadata: {
        ticketId: ticket._id,
      },
    };

    // instanciamos el service para el pago
    const service = new PaymentService();
    let result = await service.createPaymentIntent(paymentIntentInfo);
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({
        status: "error",
        error: "Ocurrio un erro con el proveedor externo.",
      });
  }
};
