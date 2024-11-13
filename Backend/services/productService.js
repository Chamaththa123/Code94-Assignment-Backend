const Product = require("../models/productModel");

// add a new product
const addProduct = async (
  sku,
  quantity,
  product_name,
  product_description,
  imagePaths
) => {
  const product = new Product({
    sku,
    quantity,
    product_name,
    product_description,
    images: imagePaths,
  });
  return await product.save();
};

// update an existing product
const updateProduct = async (
  id,
  sku,
  quantity,
  product_name,
  product_description,
  imagePaths
) => {
  const updateData = {
    sku,
    quantity,
    product_name,
    product_description,
  };

  // If new images are provided, update the images field
  if (imagePaths && imagePaths.length > 0) {
    updateData.images = imagePaths;
  }

  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

// Get all products
const getAllProducts = async () => {
  return await Product.find();
};

// Get product by ID
const getProductById = async (id) => {
  return await Product.findById(id);
};

// Delete product by ID
const deleteProductById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  addProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
};
