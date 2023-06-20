//----------------MULTER------------------------------
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({
  storage,
});

//----------------__DIRNAME------------------------------
const path = require('path');
const { fileURLToPath } = require('url');
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//---------------MONGO-------------
const { connect } = require("mongoose");
async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://mdpmclneurodiagnostic:Ncv677457000@backend51380.ig5oyhz.mongodb.net/Backend51380?retryWrites=true&w=majority"
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}

exports.connectMongo = connectMongo;

//--------------------- SOCKET ---------------------
const { Server } = require("socket.io");
const { ChatModel } = require("./DAO/models/chats.model.js");
const { ProductService } = require("./services/products.service.js");
const { CartModel } = require("./DAO/models/carts.model.js");

function connectSocket(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("addProduct", async (entries) => {
      const product = await ProductService.createOne(entries);
      socketServer.emit("addedProduct", product);
    });

    socket.on("deleteProduct", async (id) => {
      await ProductService.deleteOne(id);
      socketServer.emit("deletedProduct", id);
    });

    socket.on("msg_front_to_back", async (msg) => {
      const msgCreated = await ChatModel.create(msg);
      const messages = await ChatModel.find({});
      socketServer.emit("msg_back_to_front", messages);
    });
  });
}

exports.connectSocket = connectSocket;
      
