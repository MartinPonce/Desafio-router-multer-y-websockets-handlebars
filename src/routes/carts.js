const express = require('express');
const router = express.Router();

// Router para las rutas '/carts'
const cartsRouter = express.Router();

// Middleware para verificar si un carrito existe
function validateCart(req, res, next) {
    const cartId = req.params.id;
    const cart = carts.find((cart) => cart.id === cartId);
  
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
  
    req.cart = cart;
    next();
  }

cartsRouter.get('/', (req, res) => {
  // Obtener todos los carritos
  res.json(carts);
});

cartsRouter.get('/:id', validateCart, (req, res) => {
  // Obtener un carrito por su ID
  res.json(req.cart);
});

cartsRouter.post('/', (req, res) => {
  // Crear un nuevo carrito
  const newCart = {
    id: Math.random().toString(36).substring(7), // Generar un ID aleatorio
    products: []
  };

  carts.push(newCart);
  res.send('Carrito creado exitosamente');
});

cartsRouter.put('/:cartId/add/:productId', validateCart, validateProduct, (req, res) => {
    // Agregar un producto al carrito
    const cart = req.cart;
    const product = req.product;
  
    cart.products.push(product.id);
    res.send('Producto agregado al carrito exitosamente');
});
  
cartsRouter.delete('/:cartId/remove/:productId', validateCart, validateProduct, (req, res) => {
    // Eliminar un producto del carrito
    const cart = req.cart;
    const productId = req.product.id;
  
    cart.products = cart.products.filter((id) => id !== productId);
    res.send('Producto eliminado del carrito exitosamente');
});
  
app.use('/carts', cartsRouter);
  
  // Manejador de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Error del servidor');
});






module.exports = router;
