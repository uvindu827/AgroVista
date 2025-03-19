import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Number,
    required: true,
    default: "uncategorized",
  },
  dimensions: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  availability: {
    type: Number,
    required: true,
    default: true,
  },
  Image: {
    type: [String],
    required: true,
    default:
      "https://static.vecteezy.com/system/resources/previews/017/054/078/original/headphones-design-3d-rendering-for-product-mockup-free-png.png",
  },
});
const Product = mongoose.model("Product", productSchema);

export default Product;
