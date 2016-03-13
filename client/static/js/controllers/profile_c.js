
ballyCyrk.controller('profileController', function(userFactory, friendFactory, $routeParams, $location, $rootScope, $window){
  var _this = this;

  this.currentUser = function(){
    userFactory.show($routeParams.id, function(data){
      if (!data) {
        _this.user = {_id:$routeParams.id};
        socket.emit("refreshing", _this.user);
      } else if (data.user) {
        _this.user = data;
        userFactory.confirmLogin(_this.user, function(data){
          socket.emit("logging-in", _this.user);
        });
      };
    });
  }

  this.logout = function() {
    userFactory.logout(_this.user, function(data){
      if (!data) { $location.path('#/'); };
    });
  }

  this.allUsers = function(){
    userFactory.index($routeParams.id, function(data){
    })
    friendFactory.pending($routeParams.id, function(pend){
      userFactory.friendSort(pend, function(data){
      });
    })
    friendFactory.requested($routeParams.id, function(data){
      userFactory.friendSort(data, function(data2){
      })
    })
    friendFactory.confirmed($routeParams.id, function(data){
      userFactory.friendSort(data, function(data){
        _this.everyone = data;
        console.log(_this.everyone);
      });
    })
  }

  this.acceptRequest = function(her){
    friendFactory.accept(_this.user, her, function(data){
      if (data) {
        her.friend = true;
        userFactory.friendResort(her, function(data2){
          _this.everyone = data2;
        })
      }
    });
  }

  this.deleteRequest = function(her){
    friendFactory.delete(_this.user, her, function(data){
      userFactory.friendResort(data, function(data2){
        _this.everyone = data2;
      });
    });
  }

  this.friendRequest = function(her){
    var temp = [];
    friendFactory.request(_this.user, her, function(data){
      if (data) {
        temp.push(data);
        userFactory.friendSort(temp, function(data2){})
      }
    });
  }

  this.requestCall = function(friend){
    socket.emit("requestCall", {"receptionSocket": friend._id,
                                    "hostId": _this.user._id,
                                    "hostName": _this.user.username
                                });
  }
  // ************************* SOCKETS ****************************

  // socket.on("user-id", function(data) {
  //   console.log("USER ID SOCKET IS IN USE!!!!!!!!!!!!");
  //   $rootScope.$apply(function(){
  //     for (var onlineIdx = 0; onlineIdx < data.length; onlineIdx++) {
  //       if (_this.user._id == data[onlineIdx]._id) {
  //          _this.user.socket = data[onlineIdx].socket;
  //       } else if (_this.friends.length > 0) {
  //         for (var idx = 0; idx < _this.friends.length; idx++){
  //           if (_this.friends[idx]._id == data[onlineIdx]._id) {
  //             _this.friends[idx].socket = data[onlineIdx].socket;
  //             _this.friends[idx].online = data[onlineIdx].online;
  //           }
  //         }
  //       }
  //     }
  //   })
  // });

  socket.on("refreshed", function(data) {
    console.log("the new me", data);
    _this.user = data;
    if (!_this.user)
      $location.path('#/');
    else
      userFactory.refresh(_this.user);
  });

  socket.on("requestingCall", function(data) {
    console.log("pit");
    $rootScope.$apply(function() {
      notie.confirm(data.donorName + " wants to video call", "Accept", "Decline",function() {
        console.log("Call accepted");
        var chatroomID = data.donorSocket;
        chatroomID = chatroomID.replace(/#/g, '1');
        console.log(chatroomID);
        socket.emit("callAccepted", {"donorSocket": data.donorSocket,
                                     "chatroomID": chatroomID
                                    });
        $rootScope.$apply(function() {
          $location.path('/videoChat' + chatroomID);
        });

      }, function() {
        console.log("Call declined");
        socket.emit("callDeclined", {"donorSocket": data.donorSocket});
      });
    });
  });

  socket.on("callAccepted", function(data) {
    console.log("Donor received answer", data.chatroomID);
    $rootScope.$apply(function() {
      $location.path('/videoChat' + data.chatroomID);
    });
  });

  socket.on("callDeclined", function() {
    $rootScope.$apply(function() {
      console.log("callDeclined socket works");
      notie.alert(3, "User declined your request", 2.5);
    })
  })

  this.currentUser();
  this.allUsers();
})
