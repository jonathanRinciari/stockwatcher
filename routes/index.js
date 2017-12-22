var express = require("express");
var router = express.Router();
var fetchStocks = require("../public/scripts/fetchstocks");
var Stock = require("../models/stocks.js");

/* GET home page. */
router.get("/", (req, res) => {
  var stocksArr = [];
  Stock.find({}, (err,stocks) => {
    res.locals.dbStocks = stocks;
    if (stocks) {
      stocks.forEach((stock) => {
        stocksArr.push(stock.symbol);
      })
      if (stocksArr.length > 0) {
        var stockData = fetchStocks(stocksArr);
        Promise.all(stockData).then(data => {
          res.locals.currentStocks = data;
          
          console.log(res.locals.dbStocks)
          res.render("index", { title: "Help" });
        });
      }
    } else {
      res.render('index', {title: 'Helps'})
    }
  });
  
});

module.exports = router;
