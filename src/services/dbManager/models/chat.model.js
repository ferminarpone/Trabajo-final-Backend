import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  user: { type: String, required: true },
  message: { type: String },
  name: { type: String, required: true },
});

const chatModel = model("Messages", chatSchema);

export { chatModel };
