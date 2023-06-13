const express = require('express');
const router = express.Router();

// Middleware de validación de producto
function validateProduct(req, res, next) {
  // Verifica si hay errores de validación en la solicitud
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    next();
}

// Crear un producto

router.post('/', validateProduct, async (req, res) => {
  try {
    // Extraer los datos del producto del cuerpo de la solicitud
    const { name, price, category } = req.body;

    // Crear una instancia del modelo de producto con los datos proporcionados
    const newProduct = new Product({
      name,
      price,
      category,
    });

    // Guardar el nuevo producto en la base de datos
    await newProduct.save();

    // Devolver una respuesta exitosa
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ error: 'Error al crear el producto' });
  }
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
