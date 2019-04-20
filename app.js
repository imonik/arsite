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

app.get('/mainschedule', function(req, res) {
  var user = req.session.user;

  connection.query("SELECT * FROM schedule", function (error, result, fields) {
    if (error){
      res.render('pages/error');
      console.log(error);
    } 

    if (result.length == 0){
			res.send('No results for that email. Please try again.\n');
		} else {
      res.render('pages/mainschedule', { data: { user: user, schedule: result} });
    }
  })
});

app.get('/error', function(req, res) {
  res.render('pages/error');
});

app.post('/schedule', function(req, res){
  console.log("ADD SCHEDULE");
  var val = [req.body.class_name, req.body.start_time, req.body.end_time, 1,1];

  connection.query('INSERT INTO schedule (name, start_time, end_time, instructor_id, status) VALUES (?,?,?,?,?)', val ,function(error, result, fields){
    if (error) throw error; 
  });
});

app.get('/editschedule/:id', function(req, res){
  var user = req.session.user;
  //console.log(" GET SCHEDULE BY ID");
  //console.log("ID" + req.params.id);
  connection.query('SELECT * FROM schedule WHERE id = ?',  req.params.id ,function(error, result, fields){
    if (error) throw error; 
    console.log(result)
    if(result){
      //var date = result[0].start_time;
      let ts = new Date(result[0].start_time);
      let te = new Date(result[0].end_time);
      let date = ts.toLocaleDateString();
      let start = ts.toLocaleTimeString();
      let end = te.toLocaleTimeString();
     
      resu = {id :result[0].id, name:result[0].name , start: start , end: end, day: date, instructor: result[0].instructor_id , status: 1};
      console.log(resu.schedule);
      res.render('pages/editschedule', { data: { user: user, schedule: resu} });
    }
  });
});

app.get('/deleteschedule', function(req, res){
  console.log("DELETESCHEDULE");
  console.log( req.body.id);
  console.log( req.params.id);
  console.log( req.param.id);
  console.log( req.query.id);
  connection.query('DELETE FROM schedule WHERE id =?',  req.query.id ,function(error, result, fields){
    if (error) res.send(error);
    else res.redirect('/mainschedule'); // sends to the home route.
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
          res.redirect('/mainschedule');
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
          //console.log(results)
          res.send(results);
			}//);
		//}
});
});

app.get('/getmemberships', function(req, res){
  connection.query('SELECT * FROM memberships', function(error, result, fields){
    if(error) throw error;

    if(result.length == 0 ){
      res.send("There are not memberships to show");
    } else {
      res.send(result);
    }

  });
});

app.get('/mainstudents', function(req, res) {
  var user = req.session.user;

  connection.query("SELECT * FROM students", function (error, result, fields) {
    if (error){
      res.render('pages/error');
      console.log(error);
    } 
    console.log(result);
    if (result.length == 0){
			res.send('No results for that email. Please try again.\n');
		} else {
      
      res.render('pages/mainstudents', { data: { user: user, students : result} });
    }
  })
});

app.post('/addstudent', function(req, res){
  console.log("ADD STUDENT");
  var val = [req.body.name, req.body.last_name, req.body.start_time,  req.body.membership_type,  req.body.membership_end_date];

  connection.query('INSERT INTO students (name, last_name, started_date, membership_type, membership_end_date) VALUES (?,?,?,?,?)', val ,function(error, result, fields){
    if (error) throw error; 
  });
});


app.get('/editstudent/:id', function(req, res){
  var user = req.session.user;
  console.log("EditStudent");
  connection.query('SELECT * FROM students WHERE id = ?',  req.params.id ,function(error, result, fields){
    if (error) throw error; 
    console.log(result)
    if(result){


      console.log( { data: { user: user, student: result[0]} });
     
      res.render('pages/editstudent', { data: { user: user, student: result[0]} });
    }
  });
});

app.put('/updatestudent', function(req, res){
  var user = req.session.user;
  // let start = req.body.start_time.substring(0, req.body.start_time.indexof("T")) ;
  // let end;
  var val = [req.body.name, req.body.last_name, req.body.started_date,  req.body.membership_type,  req.body.membership_end_date, req.body.id ];
  console.log("EditStudent");
  connection.query('UPDATE students SET id = ?, name = ?, last_name = ?, started_date = ?, membership_type = ?, membership_end_date = ? WHERE id = ?', val ,function(error, result, fields){
    if (error) throw console.log(error); 
    console.log(result)
    if(result){
      console.log( { data: { user: user, student: result[0]} });
     
      res.render('pages/mainstudent', { data: { user: user, student: result[0]} });
    }
  });
});

app.get('/deletestudent', function(req, res){
  console.log("DELETESCHEDULE");
  console.log( req.body.id);
  console.log( req.params.id);
  console.log( req.param.id);
  console.log( req.query.id);
  connection.query('DELETE FROM students WHERE id =?',  req.query.id ,function(error, result, fields){
    if (error) res.send(error);
    else res.redirect('/mainschedule'); // sends to the home route.
  });
});


module.export = app;

app.listen(3000, function(){
	console.log('listening on 3000')
});//11965