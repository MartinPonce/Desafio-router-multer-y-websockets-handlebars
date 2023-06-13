const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'asc' ? 'price' : req.query.sort === 'desc' ? '-price' : null;
    const query = req.query.query || '';

    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    };

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const payload = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
    };

    res.json(payload);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener los productos' });
  }
});

// Otros endpoints para crear, actualizar y eliminar productos

// POST /api/products
router.post('/', async (req, res) => {
    try {
      const { name, price, category, availability } = req.body;
  
      const product = new Product({
        name,
        price,
        category,
        availability,
      });
  
      await product.save();
  
      res.json({ status: 'success', message: 'Producto creado correctamente' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al crear el producto' });
    }
  });
  
  // PUT /api/products/:id
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, category, availability } = req.body;
  
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      }
  
      product.name = name;
      product.price = price;
      product.category = category;
      product.availability = availability;
  
      await product.save();
  
      res.json({ status: 'success', message: 'Producto actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al actualizar el producto' });
    }
  });
  
  // DELETE /api/products/:id
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      await Product.findByIdAndDelete(id);
  
      res.json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al eliminar el producto' });
    }
  });
  
module.exports = router;
