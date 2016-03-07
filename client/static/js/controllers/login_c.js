ballyCyrk.controller('loginController', function(userFactory, $location){
  var _this = this;

  this.userLogin = function(){
    userFactory.loginUser(_this.user, function(data){
      if (data.message){
        _this.message = data
      } else {
        _this.user = data.user;
        console.log(_this.user);
        userFactory.loggedin(_this.user, function(data){
          $location.path('/profile/'+data._id);
        });
      }
    });
  }
})
