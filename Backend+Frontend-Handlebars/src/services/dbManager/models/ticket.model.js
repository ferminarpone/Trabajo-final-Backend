import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  code: { type: String },
  purchase_datetime: { type: Number },
  amount: { type: Number },
  purchaser: { type: String },
  products: []
});

const ticketModel = model("Tickets", ticketSchema);

export { ticketModel };
