const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let stockSchema = new Schema({
  name: String,
  symbol: String
});

let Stock = mongoose.model("stock", stockSchema);

module.exports = Stock;
