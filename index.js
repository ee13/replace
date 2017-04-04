var express = require("express");
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser');
var moment = require("moment");
const low = require('lowdb');
const db = low('db.json');

var timeV = "DD-MM-YYYY hh:mm:ss"

db.defaults({ 'board': [], 'users': [] }).write();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/main.html'));
  //__dirname : It will resolve to your project folder.
});
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save', function(req, res) {
  //console.log(req.body);
  var ip = req.body.ip;

  res.contentType('json');
  var now = moment();
  var currentUser = db.get('users').find({ 'ip': ip}).value();
  if (currentUser == null) {
  	//console.log("add " + ip + " at " + now.format(timeV));
  	if (db.get('board').find({'col':req.body.col, 'row':req.body.row}).value() == null) {
  		//console.log("add (" + req.body.col + ", " + req.body.row + ") = " + req.body.colour);
  		db.get('board').push({ 'col':req.body.col, 'row':req.body.row, 'colour':req.body.colour }).write();
  	} else {
  		//console.log("update (" + req.body.col + ", " + req.body.row + ") = " + req.body.colour + " from " 
  		//	+ JSON.stringify(db.get('board').find({'col':req.body.col, 'row':req.body.row}).value()));
  		db.get('board').find({'col':req.body.col, 'row':req.body.row}).set('colour',req.body.colour).write();
  	}
  	db.get('users').push({ 'ip': ip, 'time': now.format(timeV) }).write();
  	res.send({'status':0});
  } else {
  	//console.log(now + " - " + moment(currentUser.time, timeV) + " (" + currentUser.time + ")");
  	var timeLeft = now.diff(moment(currentUser.time, timeV), 'seconds');
  	if (timeLeft > 300 ) {
  		//console.log("fine time");
  		if (db.get('board').find({'col':req.body.col, 'row':req.body.row}).value() == null) {
	  		//console.log("add (" + req.body.col + ", " + req.body.row + ") = " + req.body.colour);
	  		db.get('board').push({ 'col':req.body.col, 'row':req.body.row, 'colour':req.body.colour }).write();
	  	} else {
	  		//console.log("update (" + req.body.col + ", " + req.body.row + ") = " + req.body.colour + " from " 
  			//+ JSON.stringify(db.get('board').find({'col':req.body.col, 'row':req.body.row}).value()));
	  		db.get('board').find({'col':req.body.col, 'row':req.body.row}).set('colour',req.body.colour).write();
	  	}
  		db.get('users').find({ 'ip': ip}).set( 'time', now.format(timeV) ).write();
  		res.send({'status':0});
  	} else {
  		//console.log(timeLeft + " time left");
  		res.send({'status':1, 'message':'not enough time passed'});
  	}
  }
  //console.log("ip: " + db.get('users').find({ 'ip': ip }).value());

  //res.contentType('json');
  //res.send({ some: JSON.stringify({response:'json'}) });
});

app.post('/load', function(req, res) {
  //console.log(req.body);
  var ip = req.body.ip;

  res.contentType('json');
  var now = moment();
  var currentUser = db.get('users').find({ 'ip': ip}).value();
  if (currentUser == null) {
  	res.send({'status':0, 'board':db.get('board').value()});
  } else {
  	var timeLeft = now.diff(moment(currentUser.time, timeV), 'seconds');
  	if (timeLeft > 300 ) {
  		//console.log("hu " + JSON.stringify(db.get('board').value()));
  		res.send({'status':0, 'board':db.get('board').value()});
  	} else {
  		var timeReturn = 300 - timeLeft;
  		res.send({'status':1, 'board':db.get('board').value(), 'time':timeReturn});
  	}
  }

  //res.contentType('json');
  //res.send({ some: JSON.stringify({response:'json'}) });
});

app.listen(3000);

console.log("Running at Port 3000");