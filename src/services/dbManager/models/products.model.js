import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String },
  owner: { type: String, default: "admin" }
});

productSchema.plugin(mongoosePaginate);

const productModel = model("Products", productSchema);

export { productModel };
