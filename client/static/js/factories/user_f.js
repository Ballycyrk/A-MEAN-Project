ballyCyrk.factory('userFactory', function($http, $cookies){
  var userLoggedIn = {};
  var factory = {};

  function setCookie(output) {
    $cookies.putObject('currentUser', output);
  }

  factory.create = function(user, callback){
    $http.post('/signup', user).success(function(output){
      callback(output);
    })
  }

  factory.index = function(id, callback){
    $http.get('/users/'+id).success(function(output){
      callback(output);
    })
  }

  factory.loginUser = function(user, callback){
    $http.post('/login', user).success(function(output){
      userLoggedIn = output; //consider boiling this down
      console.log("userLogin", output)
      callback(output);
    })
  }

  factory.facebook = function(callback){
    $http.get('/auth/facebook').success(function(output){
      userLoggedIn = output; //consider boiling this down
      callback(output);
    })
  }

  factory.google = function(callback){
      $http.get('/auth/google').success(function(output){
      userLoggedIn = output; //consider boiling this down
      callback(output);
    })
  }

  factory.loggedin = function(user, callback){
    console.log('user', user);
    console.log('UserLoggedIn', userLoggedIn);
    if (userLoggedIn.user._id == user._id) {
      console.log("YES");
      callback(user);
    } else {
      console.log("NO");
      callback(null);
    }
  }

  factory.show = function(id, callback){
    console.log("SHOW", id, userLoggedIn);
    if (!userLoggedIn.user)
      callback(null);
    else
      callback(userLoggedIn);
  }

  factory.confirmLogin = function(user, callback){
    if (userLoggedIn.user._id == user._id){
      callback(true);
    } else {
    console.log("user logged in - else clause", userLoggedIn);
      callback(false);
    }
  }

  factory.refresh = function(user) {
    userLoggedIn = user;
    console.log('refresh', userLoggedIn)
  }

  factory.logout = function(user, callback){
    // $cookies.remove('currentUser');
    console.log('LOGOUT', userLoggedIn);
    socket.emit("logout", userLoggedIn.user._id);
    $http.post('/logout', userLoggedIn.user).success(function(data){
      if (data){
        userLoggedIn = {};
        callback(false)
      } else {
        console.log("Error with logout");
      }
    });
  }

  return factory;
})

