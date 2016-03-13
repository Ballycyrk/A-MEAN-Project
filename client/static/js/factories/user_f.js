ballyCyrk.factory('userFactory', function($http, $cookies){
  var userLoggedIn = {};
  var others = new Array(4);
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
      for (var idx = 0; idx < output.length; idx++) {
        others.add(output[idx]);
      }
      callback(others);
    })
  }

  factory.friendSort = function(array, callback){
    for (var idx = 0; idx < array.length; idx++){
      others.fSort(array[idx]);
    }
    callback(others.unpack());
  }

  factory.friendResort = function(user, callback){
    others.remove(user);
    if (user.friend)
      user.idx = 3;
    else
      user.idx = 0;
    others.add(user);
    callback(others.unpack());
  }

  factory.loginUser = function(user, callback){
    $http.post('/login', user).success(function(output){
      userLoggedIn.user = output.user._id; //consider boiling this down
      userLoggedIn.username = output.user.username
      callback(userLoggedIn);
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
    if (userLoggedIn.user == user.user) {
      console.log("YES");
      callback(user);
    } else {
      console.log("NO");
      callback(null);
    }
  }

  factory.show = function(id, callback){
    if (!userLoggedIn.user)
      callback(null);
    else
      callback(userLoggedIn);
  }

  factory.confirmLogin = function(user, callback){
    if (userLoggedIn.user == user.user){
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
    console.log('LOGOUT', userLoggedIn.user);
    socket.emit("logout", userLoggedIn.user);
    $http.post('/logout').success(function(data){
      if (data){
        userLoggedIn = {};
        others = new Array(4);
        callback(false)
      } else {
        console.log("Error with logout");
      }
    });
  }

  factory.clear = function(){
        others = new Array(4);
  }

  return factory;
})

