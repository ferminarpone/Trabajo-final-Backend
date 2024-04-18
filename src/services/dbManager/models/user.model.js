import { Schema, model } from "mongoose";

const collection = "users";

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: { type: Number, required: true },
  password: { type: String },
  loggedBy: String,
  cart: { type: Schema.Types.ObjectId, ref: "Carts" },
  role: { type: String, default: "User", enum: ["User", "Admin", "Premium"] },
  documents: [
    {
      name: { type: String },
      reference: { type: String }
    }
  ],
  last_connection: { type: Number }
});

userSchema.pre("find", function () {
  this.populate("cart");
});

const userModel = model(collection, userSchema);

export { userModel };
