$(document).ready(function() {
  var ctx = $("#myChart");
  let stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: []
    },
    options: {
      maintainAspectRatio: true,
      responsive: true
    }
  });

  if (currentStocks.length > 0) {
    currentStocks.map(stock => {
      addStock(stock);
    });
  }

//   var socket = io.connect("http://localhost");

// $('button').click(function(){
//     var stockSymb = $('input').val();
//     if(stockSymb !== ''){
// 	socket.emit('addStock', stockSymb);
//     $('input').val('');
//     }
// });

// socket.on('stockAdded', (stockData) => {
// 	addStock(stockData);
// });

// socket.on('stockRemoved', (tockData) => {
// 	removeStock(stockData)
// });

// socket.on('invalidStock', (message) => {
// 	alert(message)
// })






  function addStock(stock) {
    let xAxisArr = [];
    let yAxisArr = [];
    stockName = stock[stock.length - 1]
    console.log(stockName)
    let stockCode = stockName.slice(stockName.lastIndexOf("(") + 1, stockName.lastIndexOf(")"));
    stock.pop(); //remove string at end of data

    stock.map(val => {
      let data = new Date(val.x);
      xAxisArr.push(moment(data).format("MMM DD YY"));
      yAxisArr.push(val.y);
    });

    stockChart.data.labels = xAxisArr.reverse();
    let newChart = {
      label: stockCode,
      data: yAxisArr,
      lineTension: 0.1,
      fill: false,
      borderColor: "red",
      borderCapStyle: "butt",
      pointBackgroundColor: "red",
      pointBorderColor: "black",
      pointHoverRadius: 2
    };
    stockChart.data.datasets.push(newChart);
    stockChart.update();
  }
});
