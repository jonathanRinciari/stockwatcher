var express = require("express");
var router = express.Router();
var fetchStocks = require('../public/scripts/fetchstocks')
var Stock = require("../models/stocks.js");

/* GET home page. */
router.get("/", (req, res) => {
  var stocksArr = ['googl', 'FB'];
  Stock.find({}, stocks => {
    if(stocks){
    stocksArr.push(stocks.symbol);
    } else {
      res.render('index', {'title': 'test' })
    }
  });
  
  var stockData = fetchStocks(stocksArr);
  Promise.all(stockData).then(data => {
    console.log(data, 'test')
    res.locals.currentStocks = data;
    res.send(data)
  });
  
});

module.exports = router;
