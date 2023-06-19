const express = require("express");
const viewsRouter = express.Router();
const ProductService = require("../services/products.service.js");
const productService = new ProductService();
const CartService = require("../services/carts.service.js");
const { ProductModel } = require("../DAO/models/products.model.js");
const cartService = new CartService();

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const queryParams = { limit, page, sort, query };
    const products = await productService.get(queryParams);
    console.log(products); //BORRAR
    return res.status(200).render("home", { products });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", msg: "Error in server", products: {} });
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productService.get();
    return res.status(200).render("realTimeProducts", { products });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", msg: "Error in server", products: {} });
  }
});

viewsRouter.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const queryParams = { limit, page, sort, query };

    const {
      payload: products,
      totalPages,
      payload,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    } = await productService.get(queryParams);
    let productsSimplified = products.map((item) => {
      return {
        _id: item._id.toString(),
        title: item.title,
        description: item.description,
        price: item.price,
        thumbnail: item.thumbnail,
        code: item.code,
        stock: item.stock,
        category: item.category,
      };
    });

    return res.render("products", {
      products: productsSimplified,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: prevLink?.substring(4) || "",
      nextLink: nextLink?.substring(4) || "",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: "Error in server" });
  }
});

viewsRouter.get("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await ProductModel.findById(pid);
    const productSimplificado = {
      _id: product._id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,
      category: product.category,
    };

    console.log(productSimplificado);
    res.render("product", { product: productSimplificado });
  } catch (error) {
    next(error);
  }
});

viewsRouter.get("/carts/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.get(cid);

    const simplifiedCart = cart.products.map((item) => {
      return {
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      };
    });
    console.log(simplifiedCart);
    res.render("cart", { cart: simplifiedCart });
  } catch (error) {
    next(error);
  }
});

module.exports = viewsRouter;