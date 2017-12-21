const express = require("express"),
  path = require("path"),
  app = express(),
  favicon = require("serve-favicon"),
  logger = require("morgan"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  index = require("./routes/index"),
  io = require("socket.io")()
  Stock = require("./models/stocks.js"),
  mongoose = require("mongoose");

require("dotenv").config();
app.io = io;
//set up database
var mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error"));

// set up socket io server side

io.on("connection", socket => {
  console.log("Client Connected");
  socket.on("disconnect", socket => {
    console.log("Client disconnected");
  });





  socket.on('addStock', (company) => {
	fetchStock(company).then((stockData) => {
		Stock.findOne({symbol: company}, (err, stock) => {
			if(err) throw err;
			if(!stock){
				if(Array.isArray(stockData)) {
					let newStock = new Stock({
						name: stockData[stockData.length - 1],
						symbol: company
					}).save((err, data) => {
						if(err) throw err;
						console.log('stock added', data.symbol)
						io.sockets.emit('stockAdded', stockData)
					})
				}
			} else {
				console.log('This stock Exists')
			}
		})
	})
})
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
