const express = require("express");
const chatRouter = express.Router();

chatRouter.get("/", async (req, res) => {
    return res.render('chat', {})
});

module.exports = chatRouter;