var express = require("express");
var router = express.Router();
var Stock = require("../models/stocks.js");

/* GET home page. */
router.get("/", () => {
  var stocksArr = [];
  Stock.find({}, stocks => {
    stocksArr.push(stocks.symbol);
  });
  var stockData = fetchStock(stocksArr);
  Promise.all(stockData).then(data => {
    res.locals.currentStocks = data;
    res.render("index");
  });
});

function fetchStock(arr){
  console.log(arr)
}

module.exports = router;
