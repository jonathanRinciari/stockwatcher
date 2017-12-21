var express = require("express");
var router = express.Router();
var fetchStocks = require("../public/scripts/fetchstocks");
var Stock = require("../models/stocks.js");

/* GET home page. */
router.get("/", (req, res) => {
  var stocksArr = ['googl'];
  Stock.find({}, stocks => {
    if (stocks) {
      stocksArr.push(stocks.symbol);
    } else {
      // res.render('index', {title: 'Helps'})
    }
  });
  if(stocksArr.length > 0){
  var stockData = fetchStocks(stocksArr);
  Promise.all(stockData).then(data => {
    res.locals.currentStocks = data;
    console.log(data[0][data[0].length - 1]);
    res.render('index', {'title': 'Help', 'data': data})
  });
}
});

module.exports = router;
