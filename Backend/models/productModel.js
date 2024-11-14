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

// Create a text index on the product_name field to enable text search
productSchema.index({ product_name: 'text' });

module.exports = mongoose.model("product", productSchema);
