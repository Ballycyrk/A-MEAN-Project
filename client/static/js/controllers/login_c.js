ballyCyrk.controller('loginController', function(userFactory, $location){
  var _this = this;

  this.userLogin = function(){
    userFactory.loginUser(_this.user, function(data){
      if (data.message){
        _this.message = data
      } else {
        _this.user = data;
        userFactory.loggedin(_this.user, function(data){
          $location.path('/profile/'+data.user);
        });
      }
    });
  }

  this.clearOthers = function(){
    userFactory.clear()
  }

  this.clearOthers();
})

