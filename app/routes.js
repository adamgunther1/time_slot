// routes ======================================================================
var User = require('./models/user');

// expose the routes to our app with module.exports
module.exports = function(app, passport) {

  // api ---------------------------------------------------------------------
  // get current user
  app.get('/api/v1/current-user', function(req, res) {
    res.json(req.isAuthenticated() ? req.user : '0');
  });

  app.put('/api/v1/current-user', function(req, res){
    User.findOne({'_id' : req.body._id}, function(err, user) {
        if (err)
            res.send(err);
        if (user) {
            user.calendar.kind = req.body.calendar.kind;
            user.calendar.etag = req.body.calendar.etag;
            user.calendar.summary = req.body.calendar.summary;
            user.calendar.timeZone = req.body.calendar.timeZone;
            user.calendar.accessRole = req.body.calendar.accessRole;
            user.calendar.nextSyncToken = req.body.calendar.nextSyncToken;
            user.calendar.items = req.body.calendar.items;
            user.freeTime = req.body.freeTime;
            user.save(function (err, user) {
                if (err) {
                    res.send(err);
                }
                // if (user) {
                //     user.calendar.items = req.body.calendar.items;
                //     user.save(function (err, user) {
                //         if (err) {
                //             res.send(err);
                //         }
                //         if (user) {
                //             user.freeTime = req.body.freeTime;
                //             user.save(function (err, user) {
                //                 if (err) {
                //                     res.send(err);
                //                 }
                                if (user) {
                                    res.json(user);
                                }
                            })
                        }
                    })
                }
            })
        }
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