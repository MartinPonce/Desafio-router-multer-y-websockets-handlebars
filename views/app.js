const express = require('express');
const {engine} = require('express-handlebars');

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const chatRouter = require('./routes/chat.router.js');

const {connectSocket} = require('./utils.js');
const {connectMongo} = require('./utils.js');

const app = express();
const port = 8080

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("src/public"));

app.engine('handlebars', engine());
app.set('view engine', '.handlebars');
app.set('views', 'src/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use("/chat", chatRouter);
app.get("*", (req, res) => {
	return res.status(404).json({
        status: "error",
        msg: "no encontrado",
        data: {},
    });
});

const httpServer = app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
});

connectMongo();
connectSocket(httpServer);

//mongodb+srv://mdpmclneurodiagnostic:Ncv677457000@backend51380.ig5oyhz.mongodb.net/?retryWrites=true&w=majority
