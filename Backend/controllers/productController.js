const productDBService = require("../services/productService");

// create a new product
const createProduct = async (req, res) => {
    try {
      const { sku, quantity, product_name, product_description } = req.body;
  
      // Map image file paths to an array of objects with 'path' and 'isMain'
      const imagePaths = req.files
        ? req.files.map((file, index) => ({
            path: file.path,
            isMain: index === 0,  // Mark the first image as the main one (optional)
          }))
        : [];
  
      // Check if at least one image is provided, return error if none
      if (imagePaths.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
      }
  
      const part = await productDBService.addProduct(
        sku,
        quantity,
        product_name,
        product_description,
        imagePaths
      );
      res.status(201).json({ message: "Product created successfully", part });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

//update an existing product
const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { sku, quantity, product_name, product_description } = req.body;
      const imagePaths = req.files
        ? req.files.map((file, index) => ({
            path: file.path,
            isMain: index === 0,  // Mark the first image as the main one (optional)
          }))
        : [];
  
      const updatedProduct = await productDBService.updateProduct(
        id,
        sku,
        quantity,
        product_name,
        product_description,
        imagePaths
      );
  
      // Check if product was found
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await productDBService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productDBService.getProductById(id);

    // Check if product was found,
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product by ID
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productDBService.deleteProductById(id);

    // Check if product was found,
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
};
