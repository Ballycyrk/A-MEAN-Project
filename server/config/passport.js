  // load all the things we need
var LocalStrategy     = require('passport-local').Strategy;
var FacebookStrategy  = require('passport-facebook').Strategy;
var GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy;
var mongoose          = require('mongoose');
// load up the User model
var User              = mongoose.model('User');
// load the auth variables
var configAuth        = require('./auth.js');
// expose this function to our app using module.exports
module.exports        = function(passport){
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email.
    usernameField : "email",
    passwordField : "password",
    passReqToCallback : true //allows us to pass back the entire request to the callback
  },
  function(req, email, password, res) { //replace done with 'res'?
    //asynchronous
    //User.findOne wont fire unless data is sent back
    process.nextTick(function() {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({'local.email' : email}, function(err, user) {
        //if there are any errors return the errors
        if (err) { return res(err); }; //in demo they did not add {}.
        // check to see if theres already a user with that email
        if (user) {
          return res(null, false, err);
        } else {
          User.findOne({email : email}, function(err, user) {
            if (err) { return res(err); };
            if (user) {
              user.username       = req.body.username;
              user.online         = true
              user.local.email    = req.body.email; // req.body.email?
              user.local.password = user.generateHash(password);
              user.save(function(err, result) {
                if (err) {
                  throw (err);
                } else {
                  return res(null, user);
                }
              })
            } else {
              var newUser = new User();
              // set the user's local credentials
              newUser.email           = req.body.email;
              newUser.username        = req.body.username;
              newUser.online          = true
              newUser.local.email     = req.body.email; // req.body.email?
              newUser.local.password  = newUser.generateHash(password); // req.body.password?
              newUser.save(function(err, result) {
                if (err) {
                  throw (err);
                } else {
                  return res(null, newUser);
                }
              });
            }
          });
        }
      });
    });
  }));
// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'
  passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, callback){
  // callback with email and password from our form
  // find a user whose email is the same as the forms email
  //we are checking to se if the user tyring to ogin already exists
    User.findOne( {email : email}, function(err, user){
      //if there are any errors, return those errors before anything else
      if(err)
        return callback(err);

      // if no user is found, return the message)
      if (!user)
        return callback(null, false, err);
      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return callback(null, false, err);
      // all is well return successful user
      user.online = true;
      user.save();
      return callback(null, user);
    });
  }));
  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({
    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    profileFields   : ["id", "emails", "displayName", "name"]
  },
  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
    // asynchronous
    process.nextTick(function() {
      // find the user in the database based on their facebook id
      User.findOne({ email : profile.emails[0].value }, function(err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);
        // if the user is found, then log them in
        if (user) {
            user.online = true;
            user.save();
            return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser            = new User();
          newUser.username       = profile.name.givenName;
          newUser.email          = profile.emails[0].value;
          newUser.online         = true;
          // set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = token; // we will save the token that facebook provides to the user
          newUser.facebook.name  = profile.name.givenName; // look at the passport user profile to see how names are returned
          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
          // save our user to the database
          newUser.save(function(err) {
            if (err)
              throw err;
            // if successful, return the new user
            return done(null, newUser);
          });
        }
      });
    });
  }));
  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(new GoogleStrategy({
    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,
  },
  function(token, refreshToken, profile, done) {
    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {
      // try to find the user based on their google id
      User.findOne({ email : profile.emails[0].value }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          user.online = true;
          user.save();
          return done(null, user);
        } else {
          // if the user isnt in our database, create a new user
          var newUser          = new User();
          // set all of the relevant information
          newUser.google.id    = profile.id;
          newUser.email        = profile.emails[0].value;
          newUser.username     = profile.name.givenName;
          newUser.online       = true;
          newUser.google.token = token;
          newUser.google.name  = profile.displayName;
          newUser.google.email = profile.emails[0].value; // pull the first email
          // save the user
          newUser.save(function(err, user) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));
};
