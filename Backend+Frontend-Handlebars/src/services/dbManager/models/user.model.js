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
  last_connection: { type: Number },
  profile_photo: { type: String, default:"https://res.cloudinary.com/dxptijmov/image/upload/v1713302871/Ecommerce/Profiles/y1hdkxycjxpky9czhdok.webp"}
});

userSchema.pre("find", function () {
  this.populate("cart");
});

const userModel = model(collection, userSchema);

export { userModel };
