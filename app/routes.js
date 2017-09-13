// routes ======================================================================
var Todo = require('./models/todo');
var User = require('./models/user');
var google = require('googleapis');
var calendar = google.calendar('v3');

// expose the routes to our app with module.exports
module.exports = function(app, passport) {

  // api ---------------------------------------------------------------------
  // get current user
  app.get('/api/v1/current-user', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
  });

  app.patch('/api/v1/current-user', function(req, res){
    //   console.log(req.body)
    User.findOne({'_id' : req.body._id}, function(err, user) {
        if (err)
            res.send(err);
        if (user) {
            user = req.body;
            user.save;
        }
    });
  });

  // get all todos
  app.get('/api/v1/todos', function(req, res) {
    
      // use mongoose to get all todos in the database
      Todo.find(function(err, todos) {

          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err)
              res.send(err)

          res.json(todos); // return all todos in JSON format
      });
  });
    
  // create todo and send back all todos after creation
  app.post('/api/v1/todos', function(req, res) {

      // create a todo, information comes from AJAX request from Angular
      Todo.create({
          text : req.body.text,
          done : false
      }, function(err, todo) {
          if (err)
              res.send(err);

          // get and return all the todos after you create another
          Todo.find(function(err, todos) {
              if (err)
                  res.send(err)
              res.json(todos);
          });
      });

  });
    
  // delete a todo
  app.delete('/api/v1/todos/:todo_id', function(req, res) {
      Todo.remove({
          _id : req.params.todo_id
      }, function(err, todo) {
          if (err)
              res.send(err);

          // get and return all the todos after you create another
          Todo.find(function(err, todos) {
              if (err)
                  res.send(err)
              res.json(todos);
          });
      });
  });


    // application -------------------------------------------------------------
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/',
            failureRedirect : '/login'
    }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    // route to test if the user is logged in or not
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });
  
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};

function isLoggedIn(req, res, next) {
    
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}