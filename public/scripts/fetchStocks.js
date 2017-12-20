const request = require('request');

module.exports = function fetchStock(company){
	if(typeof company === 'Array'){
		var p = company.map((stock, i) => {
			getStockData(stock[i])
		}
		return p 
	} else {
		return getStockData(company)
	}
}

function getStockData(company) {
	var stockData = [];
	request(url + company, (err, response, body) => {
		if(err) reject(err);
		let dataObj = JSON.parse(body);
		if(dataObj.quandl_error){
			return resolve('This Company Doesnt Exist')
		} else {
			let name = dataObj.dataset.name;
			let lengthOfData = dataObj.dataset.data.length;
			dataObj.dataset.data.map((data) => {
				stockData.push({
					x: data[0],
					y: data[1]
				});
			if(stockData.length === lengthOfData) {
				stockData.push(name)
				resolve(stockData)
			}
		});
		}
	});
});