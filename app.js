var express = require('express');
var path = require('path');
var cookieParser = require('cookie-Parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var app = express();


app.use(express.static("public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('view engine', 'ejs');
app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));
app.use(cookieParser());

var connection = mysql.createConnection({
  host     : 'localhost', // mysqlserver.cmnemrz1mbor.us-west-1.rds.amazonaws.com
  user     : 'root',
  password : 'moni',
  database : 'ar_db'
});

connection.connect();

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/backdoor', function(req, res) {
  res.render('pages/backdoor');
});

app.get('/main', function(req, res) {
  var user = req.session.user;

  //var schedule = getSchedule();

  connection.query("SELECT * FROM schedule", function (error, result, fields) {
    if (error){
      res.render('pages/error');
      console.log(error);
    } 

    if (result.length == 0){
			res.send('No results for that email. Please try again.\n');
		} 
		else {
      //console.log(JSON.stringify(result));
      res.render('pages/main', { data: { user: user, schedule: result} });
    }
  })
});

app.get('/about', function(req, res) {
  res.render('pages/about')
});

app.get('/error', function(req, res) {
  res.render('pages/error');
});
app.post('/schedule', function(req, res){

  console.log("SCHEDULE");
  var val = [req.body.class_name, req.body.start_time, req.body.end_time, 1,1];
  console.log("class name " + req.body.class_name);
  connection.query('INSERT INTO schedule (name, start_time, end_time, instructor_id, status) VALUES (?,?,?,?,?)', val ,function(error, result, fields){
    if (error) throw error; 
    //console.log("Number of records inserted: " + result.affectedRows);
  });
});

app.post('/login', function(req, res) {
  connection.query('SELECT * FROM admins WHERE email = ?', [req.body.email], function (error, results, fields) {
    if (error) throw error; 
    
    //console.log(results);

		if (results.length == 0){
			res.send('No results for that email. Please try again.\n');
		} 
		else {
			//bcrypt.compare(req.params.password, results[0].password_hash, function(err, result) {
				if (req.body.password === results[0].password) {
          //console.log('User exists ' +  results[0].email);
          // At this point the user is found in the db and is valid.
          req.session.user = results[0];
          res.redirect('/main');
				} else {
            console.log('Password does not match. Redirecting to home.');
            res.redirect('/error');
			  }
			}//);
		//}
});
});

app.get('/getinstructors', function(req, res) {
  connection.query('SELECT * FROM instructors WHERE is_active = ?', [1], function (error, results, fields) {
    if (error) throw error; 
    
    //console.log(results);

		if (results.length == 0){
			res.send('There a no instructors active.\n');
		} 
		else {
          // At this point the user is found in the db and is valid.
          //req.session.user = results[0];
          console.log(results)
          res.send(results);
			}//);
		//}
});
});


module.export = app;

app.listen(3000, function(){
	console.log('listening on 3000')
});