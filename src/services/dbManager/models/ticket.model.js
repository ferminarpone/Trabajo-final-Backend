import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const autoGenerateCode = () => {
  return uuidv4() + Math.random();
};

const ticketSchema = new Schema({
  code: { type: String, default: autoGenerateCode() },
  purchase_datetime: { type: Number },
  amount: { type: Number },
  purchaser: { type: String },
  products: []
});

const ticketModel = model("Tickets", ticketSchema);

export { ticketModel };
