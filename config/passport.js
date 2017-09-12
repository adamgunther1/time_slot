var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/models/user');

module.exports = function (passport) {
  
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done (err, user);
    });
  });

  passport.use(new GoogleStrategy({

    clientID : process.env.CLIENTID,
    clientSecret : process.env.CLIENTSECRET,
    callbackURL : process.env.CALLBACKURL,

  },

      function(token, refreshToken, profile, done) {
        process.nextTick(function() {

          User.findOne({ 'google.id' : profile.id }, function(err, user) {
            if (err)
              return done(err);
            if (user) {
              console.log(token)
              user.google.token = '5';
              return done(null, user);
            } else {
              var newUser = new User();

              newUser.google.id = profile.id;
              // newUser.google.refresh_token = refreshToken;
              newUser.google.token = 'token';
              newUser.google.name = profile.displayName;
              newUser.google.email = profile.emails[0].value;
              
              newUser.save(function(err) {
                if (err)
                  throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
  ));
};