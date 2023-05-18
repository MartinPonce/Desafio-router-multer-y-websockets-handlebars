//    * DESAFIO CLASE 8: ROUTER Y MULTER *    //   * DESAFIO WEBSOCKETS + HANDLEBARS *   //

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
  
    // Emitir la lista de productos a los clientes cuando se conecten
    socket.emit('updateProducts', products);
  
    socket.on('addProduct', (product) => {
      // Agregar el producto a la lista
      products.push(product);
  
      // Emitir la lista actualizada de productos a todos los clientes
      io.emit('updateProducts', products);
    });
  
    socket.on('removeProduct', (productId) => {
      // Eliminar el producto de la lista
      products = products.filter((product) => product.id !== productId);
  
      // Emitir la lista actualizada de productos a todos los clientes
      io.emit('updateProducts', products);
    });
  
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
      });
    });

  
// Middleware para procesar los datos en formato JSON
app.use(express.json());

// Agrego el middleware de Express para servir archivos estáticos
app.use(express.static('public'));


// Configuración de motor de plantillas Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Creo una ruta para el endpoint
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
  });

//Inicio el servidor HTTP:
const port = 8080;
http.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


// Datos simulados para productos y carritos (reemplazar con una base de datos en un escenario real)
let products = [];
let carts = [];

// Middleware para verificar si un producto existe
function validateProduct(req, res, next) {
  const productId = req.params.id;
  const product = products.find((product) => product.id === productId);

  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }

  req.product = product;
  next();
}

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

// Router para las rutas '/products'
const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  // Obtener todos los productos
  res.json(products);
});

productsRouter.get('/:id', validateProduct, (req, res) => {
  // Obtener un producto por su ID
  res.json(req.product);
});

productsRouter.post('/', (req, res) => {
  // Crear un nuevo producto
  const newProduct = req.body;

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
});

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

app.use('/products', productsRouter);

// Router para las rutas '/carts'
const cartsRouter = express.Router();

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
  
  // Iniciar el servidor en el puerto 8080
app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});
  