const {Schema, model} = require("mongoose");

const schema = new Schema({
    user: { type: String, required: true, max: 100 },
    message: { type: String, required: true, max: 100 },
});

exports.ChatModel = model('messages', schema);