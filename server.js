//    * DESAFIO CLASE 8: ROUTER Y MULTER *    //   * DESAFIO WEBSOCKETS + HANDLEBARS *   //

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const mongoose = require('mongoose');

// Conectarse a la base de datos de MongoDB
mongoose.connect('mongodb://localhost/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexión exitosa a la base de datos');
}).catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
});



app.use('/products', productsRouter);
app.use('/carts', cartsRouter);



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
}),













  












  // Iniciar el servidor en el puerto 8080
app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});
  