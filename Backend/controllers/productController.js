const productDBService = require("../services/productService");
const BASE_URL = process.env.BASE_URL;

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { sku, quantity, product_name, product_description } = req.body;

    const imagePaths = req.files
      ? req.files.map((file, index) => ({
          path: file.path,
          isMain: req.body.isMain && req.body.isMain[index] === "true",
        }))
      : [];

    if (imagePaths.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const mainImages = imagePaths.filter((image) => image.isMain);
    if (mainImages.length > 1) {
      return res
        .status(400)
        .json({ message: "Only one image can be the main image" });
    }

    //if no any main image, set first image in default
    if (mainImages.length === 0) {
      imagePaths[0].isMain = true;
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
    res.status(500).json({ message: "Server error when creating product" });
  }
};
//update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sku,
      quantity,
      product_name,
      product_description,
      removedImages,
      mainImageId,
    } = req.body;

    //update main image
    await productDBService.setMainImage(id, mainImageId);

    const imagePaths = req.files
      ? req.files.map((file, index) => ({
          path: file.path,
          isMain: req.body.isMain && req.body.isMain[index] === "true",
        }))
      : [];

    const updatedProduct = await productDBService.updateProduct(
      id,
      sku,
      quantity,
      product_name,
      product_description,
      imagePaths,
      removedImages
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when updating product" });
  }
};

// Get all products with only main images
const getAllProducts = async (req, res) => {
  try {
    const products = await productDBService.getAllProducts();

    // Filter each product to include only the main image
    const productsWithMainImage = products.map((product) => {
      const mainImage = product.images.find((image) => image.isMain);
      return {
        ...product._doc,
        mainImageURL: mainImage ? `${BASE_URL}/${mainImage.path}` : null,
      };
    });

    res.status(200).json(productsWithMainImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when fetching product" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productDBService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //  add BASE_URL to each image path
    const imagesWithUrls = product.images.map((image) => ({
      ...image._doc,
      path: `${BASE_URL}/${image.path}`,
    }));

    res.status(200).json({
      ...product._doc,
      images: imagesWithUrls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when fetching product" });
  }
};

// Delete product by ID
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productDBService.deleteProductById(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when deleting product" });
  }
};

// Search products by name
const searchProducts = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const products = await productDBService.searchProductsByName(searchTerm);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when searching product" });
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
