const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for products
const productSchema = new Schema({
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
    required: true,
  },
  images: [
    {
      path: {
        type: String,
        required: true,
      },
      // Boolean flag indicating if this image is the main image
      isMain: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("product", productSchema);
