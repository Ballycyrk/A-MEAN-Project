ballyCyrk.factory('userFactory', function($http, $cookies){
  var usersLoggedIn = [];
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
      usersLoggedIn = [];
      callback(output);
    })
  }


  factory.facebook = function(callback){
    $http.get('/auth/facebook').success(function(output){
      callback(output);
    })
  }

  factory.google = function(callback){
      $http.get('/auth/google').success(function(output){
      callback(output);
    })
  }

  factory.show = function(id, callback){
    $http.get('/user/'+id).success(function(output){
      socket.emit("getId", output);
      setCookie(output);
      callback(output);
    })
  }

  factory.loggedin = function(user, callback){
    var i = 0
    while (i < usersLoggedIn.length){
      if (user._id == usersLoggedIn[i]._id){
        var present = true;
        break;
      } else {
        i++
        console.log('i = ', i);
      };
    }
    if (!present){
      usersLoggedIn.push(user);
    };
    callback(user);
  }
  factory.confirmLogin = function(user, callback){
    var i = 0
    while (i < usersLoggedIn.length){
      if (user._id == usersLoggedIn[i]._id){
        var present = true;
        break;
      } else {
        i++
        console.log('i = ', i);
      };
    }
    if (present){
      callback(true);
    } else {
      usersLoggedIn.push(user);
      callback(true);
    }
  }
  factory.logout = function(user, callback){
    $cookies.remove('currentUser');
    for (var i =0; i < usersLoggedIn.length; i++){
      if (user._id == usersLoggedIn[i]._id){
        usersLoggedIn.splice(i,1);
    $http.post('/logout', user).success(function(data){
        });
        callback(false);
        break;
      } else {
      callback(true);
      }
    }
  }

  return factory;
})

