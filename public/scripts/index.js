$(document).ready(function() {
  var ctx = $("#myChart");
  let stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: []
    },
    options: {
      maintainAspectRatio: false,
      responsive: true
    }
  });

  if (currentStocks.length > 0) {
    currentStocks.map(stock => {
      addStock(stock);
    });
  }

  var socket = io.connect();

  $('input[type=text').keypress(function(e){
    var key = e.which;
    var stockSymb = $('input').val();
    if(key == 13 && stockSymb !== ""){
      stockSymb = stockSymb.toUpperCase();
      socket.emit("addStock", stockSymb);
      $("input").val("");
    }
  })
  $("button").click(function() {
    var stockSymb = $("input").val();
    if (stockSymb !== "") {
      stockSymb = stockSymb.toUpperCase();
      socket.emit("addStock", stockSymb);
      $("input").val("");
    }
  });

  socket.on("stockAdded", stockData => {
    addStock(stockData, { new: true });
  });

  socket.on("stockRemoved", stockData => {
    removeStock(stockData);
  });

  socket.on("invalidStock", message => {
    alert(message);
  });

  function deleteHandler() {
    $(".delete").click(function() {
      socket.emit("removeStock", $(this).attr("id"));
    });
  }

  function removeStock(stock) {
    var foundStock = $("#" + stock.symbol).parents()[1];
    foundStock.remove();

    //Stock Chart is not updating after removal

    stockChart.data.datasets.forEach((stocks, i) => {
      if (stocks.label === stock.symbol) {
        var a = stockChart.data.datasets.splice(i, i + 1);
      }
    });
    stockChart.update();
  }
  deleteHandler();

  function addStock(stock, newStock) {
    let xAxisArr = [];
    let yAxisArr = [];
    let stockName = stock[stock.length - 1];
    let stockCode = stockName.slice(
      stockName.lastIndexOf("(") + 1,
      stockName.lastIndexOf(")")
    );
    if (newStock) {
      addStockCard(stock);
    }
    stock.pop(); //remove string at end of data

    stock.map(val => {
      let data = new Date(val.x);
      xAxisArr.push(moment(data).format("MMM DD YY"));
      yAxisArr.push(val.y);
    });

    stockChart.data.labels = xAxisArr.reverse();
    var color = randomRGB();
    let newChart = {
      label: stockCode,
      data: yAxisArr,
      lineTension: 0.1,
      fill: false,
      borderColor: color,
      borderCapStyle: "round",
      pointBackgroundColor: color,
      pointBorderColor: "black",
      pointHoverRadius: 1
    };
    stockChart.data.datasets.push(newChart);
    stockChart.update();
  }

  function randomRGB() {
    var r = Math.floor(Math.random() * 256); // Random between 0-255
    var g = Math.floor(Math.random() * 256); // Random between 0-255
    var b = Math.floor(Math.random() * 256); // Random between 0-255
    var rgb = "rgb(" + r + "," + g + "," + b + ")"; // Collect all to a string
    return rgb;
  }

  function addStockCard(stock) {
    var stockName = stock[stock.length - 1];

    var stockCode = stockName.slice(
      stockName.lastIndexOf("(") + 1,
      stockName.lastIndexOf(")")
    );
    $("#stockCardContainer").append(
      `<div class="stockCard">
            <div class="symbolContainer"><span>${stockCode}</span><span class="delete" id=${stockCode}>X</span></div>
            <div class="companyName"><span>${stockName}</span></div>
      </div>`
    );
    deleteHandler();
  }
});
