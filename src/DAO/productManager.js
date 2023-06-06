// dao/productManager.js

const Product = require('./models/Product');

async function getAllProducts() {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error('Error al obtener los productos');
  }
}

async function getProductById(productId) {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    throw new Error('Error al obtener el producto');
  }
}

async function createProduct(productData) {
  try {
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    throw new Error('Error al crear el producto');
  }
}

async function updateProduct(productId, productData) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
    return updatedProduct;
  } catch (error) {
    throw new Error('Error al actualizar el producto');
  }
}

async function deleteProduct(productId) {
  try {
    await Product.findByIdAndRemove(productId);
  } catch (error) {
    throw new Error('Error al eliminar el producto');
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
