ballyCyrk.factory('friendFactory', function($http){
  var factory = {};

  factory.request = function(him, her, callback){
    $http.post('/request', {him: him, her: her}).success(function(output){
      if (output._id) {
        var her = {};
        her.username  = output.her.username.username;
        her.user      = output.her.username.user;
        her.fStatus   = 1;
        callback(her);
      } else {
        callback(false);
      }
    });
  }

  factory.delete = function(him, her, callback){
    $http.post('/delete', {him: him, her: her}).success(function(output){
      callback(output);
    });
  }

  factory.pending = function(id, callback){
      console.log("ID", id)
    $http.get('/pending/'+id).success(function(output){
      callback(output);
    });
  }

  factory.confirmed = function(id, callback){
    $http.post('/confirm/'+id).success(function(output){
      callback(output);
    });
  }

  factory.requested = function(id, callback){
    $http.get('/requests/'+id).success(function(output){
      callback(output);
    })
  }

  factory.accept = function(him, her, callback){
    $http.post('/accept', {him: him, her: her}).success(function(output){
      if (output.username.user == her.user)
        callback(true);
      else
        callback(false);
    })
  }

  return factory;
})
