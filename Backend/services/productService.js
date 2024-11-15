const Product = require("../models/productModel");

// Add a new product
const addProduct = async (
  sku,
  quantity,
  product_name,
  product_description,
  imagePaths
) => {
  try {
    const product = new Product({
      sku,
      quantity,
      product_name,
      product_description,
      images: imagePaths,
    });
    return await product.save();
  } catch (error) {
    throw new Error("Error creating product");
  }
};

// Update an existing product and remove selected images
const updateProduct = async (
  id,
  sku,
  quantity,
  product_name,
  product_description,
  imagePaths,
  removedImages // removed image id list
) => {
  try {
    const updateData = {
      sku,
      quantity,
      product_name,
      product_description,
    };

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Filter removed images
    if (removedImages && removedImages.length > 0) {
      updateData.images = existingProduct.images.filter(
        (image) => !removedImages.includes(image._id.toString())
      );
    } else {
      updateData.images = existingProduct.images;
    }

    // If new images are added, add them to the updated images array
    if (imagePaths && imagePaths.length > 0) {
      updateData.images = [...updateData.images, ...imagePaths];
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return updatedProduct;
  } catch (error) {
    throw new Error("Error updating product");
  }
};

// Set an image as the main image and set false for other images
const setMainImage = async (productId, imageId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // Update all images to set isMain = false
    product.images.forEach((image) => {
      image.isMain = false;
    });

    // Find the image, set its isMain to true for seletd image
    const imageToSetAsMain = product.images.find(
      (image) => image._id.toString() === imageId.toString()
    );

    if (!imageToSetAsMain) {
      throw new Error("Image not found");
    }

    imageToSetAsMain.isMain = true;

    const updatedProduct = await product.save();

    return updatedProduct;
  } catch (error) {
    throw new Error("Error setting main image");
  }
};

// Get all products
const getAllProducts = async () => {
  try {
    return await Product.find();
  } catch (error) {
    throw new Error("Error fetching products");
  }
};

// Get product by ID
const getProductById = async (id) => {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw new Error("Error fetching product by ID");
  }
};

// Delete product by ID
const deleteProductById = async (id) => {
  try {
    return await Product.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error deleting product");
  }
};

// Search products by name
const searchProductsByName = async (searchTerm) => {
  try {
    const products = await Product.find({
      $text: { $search: searchTerm },
    });
    return products;
  } catch (error) {
    throw new Error("Error searching products by name");
  }
};

module.exports = {
  addProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  searchProductsByName,
  setMainImage,
};
