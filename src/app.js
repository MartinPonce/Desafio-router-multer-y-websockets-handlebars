const MongoStore = require('connect-mongo');
const express = require('express');
const handlebars = require('express-handlebars');
const {engine} = require('express-handlebars');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const chatRouter = require('./routes/chat.router.js');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const { iniPassport } = require('./config/passport.config.js');
const { sessionsRouter } = require('./routes/sessions.router.js');
const { viewsRouter } = require('./routes/views.router.js');
const { __dirname, connectMongo, connectSocket } = require('./utils.js');
const { usersRouter } = require('./routes/users.router.js');


const { usersHtmlRouter } = require('./routes/users.html.router.js');

const app = express();
const port = 3000;

const httpServer = app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
});

connectMongo();
connectSocket(httpServer);


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());

app.use(express.static("src/public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'top-secret', resave: true, saveUninitialized: true }));

app.get('/session', (req, res) => {
    console.log(req.session);
    if (req.session?.cont) {
      req.session.cont++;
      res.send(JSON.stringify(req.session));
    } else {
      req.session.cont = 1;
      req.session.busqueda = 'cetosis';
      res.send(JSON.stringify(req.session));
    }
  });
  
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.json({ status: 'session eliminar ERROR' });
      }
      res.send('Logout ok!');
    });
  });

app.get('/login', (req, res) => {
    //console.log(req.session.user, req.session.admin);
    const { username, password } = req.query;
    if (username !== 'martin' || password !== 'martinpass') {
      return res.send('login failed');
    }
    req.session.user = username;
    req.session.admin = true;
    res.send('login success!');
  });
  
  app.get('/logout', (req, res) => {
    // console.log(req?.session?.user, req?.session?.admin);
    req.session.destroy((err) => {
      if (err) {
        return res.json({ status: 'Logout ERROR', body: err });
      }
      res.send('Logout ok!');
    });
    // console.log(req?.session?.user, req?.session?.admin);
  });

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

app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://mdpmclneurodiagnostic:Ncv677457000@backend51380.ig5oyhz.mongodb.net/?retryWrites=true&w=majority', ttl:7200 }),
    secret: 'top-secret',
    resave: true,
    saveUninitialized: true,
  })
);

//-----TODO LO DE PASSPORT-------
iniPassport();
app.use(passport.initialize());
app.use(passport.session());
//FIN TODO LO DE PASSPORT

//---------CONFIG RUTAS------------
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
/* app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/users', usersHtmlRouter);
app.use('/test-chat', testSocketChatRouter);
app.use('/auth', authRouter); */
app.get('*', (_, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'no encontrado',
    data: {},
  });
});


//mongodb+srv://mdpmclneurodiagnostic:Ncv677457000@backend51380.ig5oyhz.mongodb.net/?retryWrites=true&w=majority
