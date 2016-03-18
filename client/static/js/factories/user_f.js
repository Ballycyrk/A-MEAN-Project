ballyCyrk.factory('userFactory', function($http){
  var userLoggedIn = {};
  var onCallWith = "";
  var others = new Array(4);
  var factory = {};

  factory.create = function(user, callback){
    $http.post('/signup', user).success(function(output){
      userLoggedIn.user = output.user._id;
      userLoggedIn.username = output.user.username;
      callback(userLoggedIn);
    })
  }

  factory.loginUser = function(user, callback){
    $http.post('/login', user).success(function(output){
      if (output.message) {
        callback(output);
      } else {
        userLoggedIn.user = output.user._id;
        userLoggedIn.username = output.user.username;
        callback(userLoggedIn);
      }
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
      callback(output);
    })
  }

  factory.confirmLogin = function(user, callback){
    if (userLoggedIn.user == user.user){
      callback(true);
    } else {
      callback(false);
    }
  }

  factory.loggedin = function(user, callback){
    if (userLoggedIn.user == user.user) {
      callback(user);
    } else {
      callback(null);
    }
  }

  factory.show = function(id, callback){
    if (!userLoggedIn.user)
      callback(null);
    else
      callback(userLoggedIn);
  }

  factory.refresh = function(user) {
    userLoggedIn = user;
  }

  factory.logout = function(user, callback){
    socket.emit("logout", userLoggedIn.user);
    $http.post('/logout').success(function(data){
      if (data){
        userLoggedIn = {};
        onCallWith = "";
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

  factory.index = function(id, callback){
    $http.get('/users/'+id).success(function(output){
      for (var idx = 0; idx < output.length; idx++) {
        others.add(output[idx]);
      }
      callback(others);
    })
  }

  factory.friendSort = function(array, callback){
    console.log("FSORT", array);
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

  factory.update = function(user, callback){
    others.update(user);
    callback(others.unpack());
  }

  factory.videoCallers = function(callback){
    callback({me: userLoggedIn, friend: onCallWith});
  }

  factory.chat = function(friend){
    onCallWith = friend;
  }

  return factory;
})

