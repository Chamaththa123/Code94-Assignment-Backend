const productDBService = require("../services/productService");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { sku, quantity, product_name, product_description } = req.body;

    // Map image file paths to an array of objects with 'path' and 'isMain'
    const imagePaths = req.files
      ? req.files.map((file, index) => ({
          path: file.path,
          isMain: req.body.isMain && req.body.isMain[index] === "true", // Check if the main image is indicated
        }))
      : [];

    // Ensure at least one image is provided
    if (imagePaths.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    // Validate that only one image is marked as main
    const mainImages = imagePaths.filter((image) => image.isMain);
    if (mainImages.length > 1) {
      return res
        .status(400)
        .json({ message: "Only one image can be the main image" });
    }

    const product = await productDBService.addProduct(
      sku,
      quantity,
      product_name,
      product_description,
      imagePaths
    );
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when fetchin data" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { sku, quantity, product_name, product_description } = req.body;

    const imagePaths = req.files
      ? req.files.map((file, index) => ({
          path: file.path,
          isMain: req.body.isMain && req.body.isMain[index] === "true", // Main image check
        }))
      : [];

    // Validate that only one image is marked as main
    const mainImages = imagePaths.filter((image) => image.isMain);
    if (mainImages.length > 1) {
      return res
        .status(400)
        .json({ message: "Only one image can be the main image" });
    }

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

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products with only main images
const getAllProducts = async (req, res) => {
  try {
    const products = await productDBService.getAllProducts();

    // Filter images to only include the main image for each product
    const productsWithMainImage = products.map((product) => {
      const mainImage = product.images.find((image) => image.isMain);
      return {
        ...product._doc,
        images: mainImage ? [mainImage] : [],
      };
    });

    res.status(200).json(productsWithMainImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
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

// Search products by name
const searchProducts = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    console.log(searchTerm)
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Call the service method to search for products
    const products = await productDBService.searchProductsByName(searchTerm);
console.log(products)
    res.status(200).json(products);
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
  searchProducts,
};
