const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  searchProducts
} = require("../controllers/productController");
const upload = require("../middleware/upload");

// Route to add product
router.post("/", upload.array("images"), createProduct);

// Route to update product
router.put("/:id", upload.array("images"), updateProduct);

// Route to get all products
router.get("/", getAllProducts);

// Route to search for products by name
router.get("/search", searchProducts);

// Route to get product by ID
router.get("/:id", getProductById);

// Route to delete product by ID
router.delete("/:id", deleteProductById);


module.exports = router;
