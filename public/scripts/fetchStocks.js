const request = require("request");
require("dotenv").config();

module.exports = function fetchStocks(company) {
  if (Array.isArray(company)) {
    var stockPromises = company.map(stock => {
      return getStockData(stock);
    });
    return stockPromises;
  } else {
    return getStockData(company);
  }
};

function getStockData(company, date) {
  var stockData = [];
  if(!date){
    date = '2017-06-01'
  } else {

  }
  return new Promise((resolve, reject) => {
    request(
      `https://www.quandl.com/api/v3/datasets/WIKI/${company}.json?start_date=${date}&api_key=${process.env.API_KEY}`,
      (err, response, body) => {
        if (err) reject(err);
        let dataObj = JSON.parse(body);
        if (dataObj.quandl_error) {
          return resolve("This Company Doesnt Exist");
        } else {
          let name = dataObj.dataset.name;
          let lengthOfData = dataObj.dataset.data.length;
          dataObj.dataset.data.map(data => {
            stockData.push({
              x: data[0],
              y: data[1]
            });
            if (stockData.length === lengthOfData) {
              stockData.push(name);
              resolve(stockData);
            }
          });
        }
      }
    );
  });
}
