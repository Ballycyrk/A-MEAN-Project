var user                = require('../controllers/users.js');
var friendship          = require('../controllers/friendships.js');

module.exports = function(app, passport){
  app.get('/user/:id',      user.get)
  app.get('/users/:id',     user.index)
  app.get('/login',         user.nolog)
  app.post('/request',      friendship.request)
  app.get('/pending/:id',   friendship.pending)
  app.get('/requests/:id',  friendship.requested)
  app.post('/confirm/:id',  friendship.confirm)
  app.post('/delete',       friendship.delete)
  app.post('/accept',       friendship.accept)
  // =====================================
  // LOCAL ROUTES ========================
  // =====================================
  // route for facebook authentication and login
  // show the login form & pass any flash data if it exists
  // res.render('login.ejs', {message: req.flash('loginMessage') });
  app.post('/login',            passport.authenticate('local-login', {
    successRedirect : '/localProfile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an errorc
    failureFlash : true // allow flash messages
  }));
  app.get('/signup',            function(req,res) {user.fail(req, res) })
  //show the signup form & render the page and pass in any flash data
  //res.render('signup.ejs, { message: req.flash('signupMessage') });
  app.post('/signup',           passport.authenticate('local-signup', { //
    failureRedirect : '/signup' }),
    // function to specifically handle the callback and pass json back
    function(req, res) {
      res.json({user: req.user});
  });
  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook',
                                                  { scope : ['email'] }));
  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
  }));
  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails
  app.get('/auth/google', passport.authenticate('google',
                          { scope : ['profile', 'email'] }));
  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
          passport.authenticate('google', {
                  successRedirect : '/profile',
                  failureRedirect : '/'
          }));

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/localProfile', isLoggedIn, function(req, res) {
    res.json({user: req.user});
  });
  app.get('/profile', isLoggedIn, function(req, res) {
    res.redirect('/#/profile/'+req.user._id);
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.post('/logout', function(req, res) {
    user.logout(req, res)
    req.logout();
    res.json({success: true});
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // console.log(req.isAuthenticated());
  // console.log(next());
  //if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  //if they aren't redirect them to the home page
  res.redirect('/');
}
