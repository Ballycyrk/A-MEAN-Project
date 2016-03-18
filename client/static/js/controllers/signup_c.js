ballyCyrk.controller('signupController', function(userFactory, $location){
  var _this = this;

  this.signup = function(){
    userFactory.create(_this.user, function(data){
      if (data.message){
        _this.message = data;
      } else {
        _this.user = data;
        userFactory.loggedin(_this.user, function(data){
          $location.path('/profile/'+data.user);
        });
      }
    });
  }

  this.logout = function(){
    if (!_this.user){
      $location.path('#/')
    } else {
      userFactory.logout(_this.user, function(data){
        console.log(data);
        if (!data) { $location.path('#/'); };
      });
    }
  }
})

