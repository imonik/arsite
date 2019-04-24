var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var moment = require('moment');
var app = express();


app.use(express.static("public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('view engine', 'ejs');
app.use(session({ secret: 'app', cookie: { maxAge: 60000*12 }})); // milliseconds
app.use(cookieParser());

var connection = mysql.createConnection({
  host     : 'mysqlserver.cmnemrz1mbor.us-west-1.rds.amazonaws.com',
  user     : 'root',
  password : 'password',
  database : 'ar_db',
  timezone: 'utc'  
});


connection.connect();

app.get('/', function(req, res) {
  res.render('pages/index');
});


app.get('/backdoor', function(req, res) {
  res.render('pages/backdoor', {message:""});
});

app.get('/mainschedule', function(req, res) {
  var user = req.session.user;
  if (!user) {
    console.log('Session expired or not set. Redirecting to home.');
    res.redirect('/backdoor');
  }
  connection.query("Select s.*, i.name as instructor FROM ar_db.schedule as s join instructors i on s.instructor_id = i.id", function (error, result, fields) {
    let date;
    let startTime;
    if (error){
      res.render('pages/error', {message : error});
      console.log(error);
    } 
    if (result.length == 0){
			res.send('No results for that email. Please try again.\n');
		} else {
       for (let i = 0; i < result.length; i++) {
         let fullDate = new Date(result[i].date);
         let date2 = moment(fullDate.toISOString().substring(0, 10), 'YYYY/MM/DD');
         let train_date = date2.format('DD/MM/YYYY');
         result[i].date = train_date;
         let startTime = result[i].start.substring(0,5);
         let endTime = result[i].end.substring(0,5);
        result[i].start = startTime;
        endTime = result[i].end = endTime;
       }
      res.render('pages/mainschedule', { data: { user: user, schedule: result} });
    }
  })
});

app.get('/error', function(req, res) {
  res.render('pages/error');
});

app.post('/schedule', function(req, res){
  var user = req.session.user;

  if (!user) {
    console.log('Session expired or not set. Terminating request.');
    res.status(403).json({ success: false, message: "Session does not exist or has expired.", session_alive: false });
    return;
  }
  var val = [req.body.class_name, req.body.date, req.body.start , req.body.end, req.body.instructor_id,1];
console.log(val);
  connection.query('INSERT INTO schedule (name, date, start, end,instructor_id, status) VALUES (?,?,?,?,?,?)', val ,function(error, result, fields){
    if (error) throw error; 
    else res.json({result: "success"});
  });
});

app.get('/editschedule/:id', function(req, res){
  var user = req.session.user;
  connection.query('SELECT * FROM schedule WHERE id = ?',  req.params.id ,function(error, result, fields){
    if (error) throw error; 
    console.log(result)
    if(result){
      let fullDate = new Date(result[0].date);
      let date2 = moment(fullDate.toISOString().substring(0, 10), 'YYYY/MM/DD');
      let train_date = date2.format('DD/MM/YYYY');
      result[0].date = train_date;
      let startTime = result[0].start.substring(0,5);
      let endTime = result[0].end.substring(0,5);
      res.render('pages/editschedule', { data: { user: user, schedule: result[0]} });
    }
  });
});

app.put('/updateschedule', function(req, res){
  var user = req.session.user;

  var val =  [req.body.class_name, req.body.date, req.body.start , req.body.end, req.body.instructor_id, req.body.id ];
  console.log("EditSchedule", val);
  connection.query('UPDATE schedule SET name = ?, date = ?, start = ?, end = ?, instructor_id = ? WHERE id = ?', val ,function(error, result, fields){
    if (error) throw console.log("error " + error); 
    console.log(result)
    if(result){
    }
    res.redirect('/mainschedule');
  }); 
}); 

app.get('/deleteschedule', function(req, res){
  console.log("DELETESCHEDULE");
  connection.query('DELETE FROM schedule WHERE id =?',  req.query.id ,function(error, result, fields){
    if (error) res.send(error);
    else res.redirect('/mainschedule'); // sends to the home route.
  });
});

app.post('/login', function(req, res) {
  connection.query('SELECT * FROM admins WHERE email = ?', [req.body.email], function (error, results, fields) {
    if (error) throw error; 
    
		if (results.length == 0) {
      res.send('pages/backdoor', { message:'User or password does not exist. Redirecting to home.' });
		} 
		else {
			//bcrypt.compare(req.params.password, results[0].password_hash, function(err, result) {
				if (req.body.password === results[0].password) {
          //console.log('User exists ' +  results[0].email);
          // At this point the user is found in the db and is valid.
          req.session.user = results[0];
          res.redirect('/mainschedule');
				} else {
            //console.log('Password does not match. Redirecting to home.');
            //res.redirect('/error');
            res.send('pages/backdoor', { message:'User or password does not exist. Redirecting to home.' });
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

  if (!user) {
    console.log('Session expired or not set. Redirecting to home.');
    res.redirect('/backdoor');
  }

  connection.query("SELECT s.*, m.description FROM students s join memberships m on m.id = s.membership_type", function (error, result, fields) {
    if (error) {
      console.log(error);
      res.render('pages/error');
    } 
    if(result.length == 0){
      console.log("no results ");
    } else {
      for (let i = 0; i < result.length; i++) {
        let fullDate = new Date(result[i].membership_end_date);
        let date2 = moment(fullDate.toISOString().substring(0, 10), 'YYYY/MM/DD');
        let train_date = date2.format('DD/MM/YYYY');
        result[i].membership_end_date = train_date;
      }
    }
    console.log(result);
    res.render('pages/mainstudents', { data: { user: user, students: result } });
  })
});

app.post('/addstudent', function(req, res) {
  var user = req.session.user;

  if (!user) {
    console.log('Session expired or not set. Terminating request.');
    res.status(403).json({ success: false, message: "Session does not exist or has expired.", session_alive: false });
    return;
  }

  var val = [req.body.name, req.body.last_name, req.body.start_time, req.body.membership_type, req.body.membership_end_date];

  connection.query('INSERT INTO students (name, last_name, started_date, membership_type, membership_end_date) VALUES (?,?,?,?,?)', val ,function(error, result, fields) {
    if (error) throw error; 
    else res.json({result: "success"});
  });
});


app.get('/editstudent/:id', function(req, res){
  var user = req.session.user;

  if (!user) {
    console.log('Session expired or not set. Redirecting to home.');
    res.redirect('/backdoor');
  }

  connection.query('SELECT * FROM students WHERE id = ?',  req.params.id ,function(error, result, fields){
    if (error) throw error; 

    if(result){
      let fullDate = new Date(result[0].membership_end_date);
      let fullDate2 = new Date(result[0].started_date);
      let date2 = moment(fullDate.toISOString().substring(0, 10), 'YYYY/MM/DD');
      let date3 = moment(fullDate2.toISOString().substring(0, 10), 'YYYY/MM/DD');
      let train_date = date2.format('DD/MM/YYYY');
      let train_date2 = date3.format('DD/MM/YYYY');
      result[0].membership_end_date = train_date;
      result[0].started_date = train_date2;
      res.render('pages/editstudent', { data: { user: user, student: result[0]} });
    }
  });
});

app.put('/updatestudent', function(req, res){
  var user = req.session.user;

  var val = [req.body.name, req.body.last_name, req.body.started_date,  req.body.membership_type,  req.body.membership_end_date, req.body.id ];
  console.log("EditStudent");
  connection.query('UPDATE students SET name = ?, last_name = ?, started_date = ?, membership_type = ?, membership_end_date = ? WHERE id = ?', val ,function(error, result, fields){
    if (error) throw console.log("error " + error); 
    console.log(result)
    if(result){
      console.log( { data: { user: user, student: result[0]} });
    }
    res.redirect('/mainstudents');
  }); 
}); 

app.get('/deletestudent', function(req, res){
  var user = req.session.user;
  connection.query('DELETE FROM students WHERE id =?',  req.query.id ,function(error, result, fields){
    if (error) res.send(error);
    else res.redirect('/mainstudents'); // sends to the home route.
  });
});

app.get('/logout', function(req, res){
	req.session.destroy(function(err) {
	   res.redirect('/')
	})
})


module.export = app;

app.listen(3000, function(){
	console.log('listening on 3000')
});//11965