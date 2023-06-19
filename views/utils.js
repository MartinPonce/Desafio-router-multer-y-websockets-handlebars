//---------------MONGO-------------
const { connect } = require("mongoose");
async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://mdpmclneurodiagnostic:Ncv677457000@backend51380.ig5oyhz.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("plug to mongo!");
    /* let student = await CartModel.find({}).populate("products.product");
    console.log(JSON.stringify(student, null, 2)); */
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
      
