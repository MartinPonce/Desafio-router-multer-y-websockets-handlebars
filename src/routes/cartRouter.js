const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

// DELETE /api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter((product) => product.toString() !== pid);

    await cart.save();

    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
  }
});

// Otros endpoints para actualizar el carrito y eliminar productos del carrito

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
  
      const cart = await Cart.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }
  
      cart.products = products;
  
      await cart.save();
  
      res.json({ status: 'success', message: 'Carrito actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
    }
  });
  
  // PUT /api/carts/:cid/products/:pid
  router.put('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
  
      const cart = await Cart.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }
  
      const productIndex = cart.products.findIndex((product) => product._id.toString() === pid);
  
      if (productIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
      }
  
      cart.products[productIndex].quantity = quantity;
  
      await cart.save();
  
      res.json({ status: 'success', message: 'Cantidad del producto actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto' });
    }
  });
  
  // DELETE /api/carts/:cid
  router.delete('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
  
      await Cart.findByIdAndDelete(cid);
  
      res.json({ status: 'success', message: 'Carrito eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al eliminar el carrito' });
    }
  });
  
module.exports = router;
