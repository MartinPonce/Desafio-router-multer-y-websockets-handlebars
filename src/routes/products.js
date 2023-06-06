const express = require('express');
const router = express.Router();

// Middleware de validación de producto
function validateProduct(req, res, next) {
  // Validar el producto aquí
  next();
}

// Crear un producto
router.post('/', validateProduct, (req, res) => {
  // Lógica para crear un producto
});



// Verificar si el producto ya existe
const existingProduct = products.find(
    (product) => product.id === newProduct.id
  );
  if (existingProduct) {
    return res.status(409).send('El producto ya existe');
  }

  products.push(newProduct);
  io.emit('addProduct', newProduct);
  res.send('Producto creado exitosamente');


productsRouter.put('/:id', validateProduct, (req, res) => {
  // Actualizar un producto por su ID
  const updatedProduct = req.body;
  req.product.name = updatedProduct.name;
  req.product.price = updatedProduct.price;
  res.send('Producto actualizado exitosamente');
});

productsRouter.delete('/:id', validateProduct, (req, res) => {
  // Eliminar un producto por su ID
  products = products.filter((product) => product.id !== req.product.id);
  io.emit('removeProduct', req.params.id);
  res.send('Producto eliminado exitosamente');
});


module.exports = router;
