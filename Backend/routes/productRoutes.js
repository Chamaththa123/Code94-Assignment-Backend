const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  searchProducts,
} = require("../controllers/productController");
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/authMiddleware");

// Route to add product
router.post("/", verifyToken, upload.array("images"), createProduct);

// Route to update product
router.put("/:id", verifyToken, upload.array("images"), updateProduct);

// Route to get all products
router.get("/", verifyToken, getAllProducts);

// Route to search for products by name
router.get("/search", verifyToken, searchProducts);

// Route to get product by ID
router.get("/:id", verifyToken, getProductById);

// Route to delete product by ID
router.delete("/:id", verifyToken, deleteProductById);

module.exports = router;
