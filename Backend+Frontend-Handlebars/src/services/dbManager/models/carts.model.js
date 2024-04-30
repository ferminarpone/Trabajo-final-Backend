import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Products" },
      quantity: { type: Number },
    },
  ],
});

cartSchema.pre("find", function () {
  this.populate("products.productId");
});
const cartModel = model("Carts", cartSchema);

export { cartModel };
