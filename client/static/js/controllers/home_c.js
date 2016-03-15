ballyCyrk.controller('homeController', function(userFactory, $location){
  var _this = this;

  this.facebook = function(){
    userFactory.facebook(function(data){
      console.log('HOME', data);
      debugger
    });
  };

  this.google = function(){
    userFactory.google(function(data){
      console.log('HOME.GOOGLE', data);
    });
  };

  this.test = function(){
    userFactory.test2();
  }
});


