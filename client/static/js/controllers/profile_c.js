
ballyCyrk.controller('profileController', function(userFactory, friendFactory, $routeParams, $location, $rootScope, $window){
  var _this = this;

  this.currentUser = function(){
    userFactory.show($routeParams.id, function(data){
      _this.user = data;
      userFactory.confirmLogin(_this.user, function(data){
        if (!data) { $location.path('#/'); }
      });
    });
  }

  this.allUsers = function(){
    userFactory.index($routeParams.id, function(data){
      _this.everyone = data;
      console.log("EVERYONE:",_this.everyone);
    });
  }

  this.logout = function() {
    socket.emit("logout", {user: _this.user});
    userFactory.logout(_this.user, function(data){
      if (!data) { $location.path('#/'); };
    });
  }

  this.pending = function(){
    friendFactory.pending($routeParams.id, function(data){
      _this.pendingFriends = data;
      console.log("PENDING", data);
      var temp = _this.everyone;
      for (var p = 0; p < _this.pendingFriends.length; p++){
        for (var e =0; e < _this.everyone.length; e++){
          if(_this.pendingFriends[p]._id == temp[e]._id){
            _this.everyone.splice(e,1);
            break
          }
        }
      }
    });
  }

  this.confirmed = function(){
    friendFactory.confirmed($routeParams.id, function(data){
      _this.friends = data;
      console.log("FRIENDS: ", data);
      if (_this.requestedFriendship) {
        var temp = _this.requestedFriendship;
        for (var p = 0; p < _this.friends.length; p++){
          for (var e =0; e < _this.requestedFriendship.length; e++){
            if(_this.friends[p]._id == temp[e]._id){
              _this.requestedFriendship.splice(e,1);
              break
            }
          }
        }
      }
      temp = _this.everyone;
      for (var p = 0; p < _this.friends.length; p++){
        for (var e =0; e < _this.everyone.length; e++){
          if(_this.friends[p]._id == temp[e]._id){
            _this.everyone.splice(e,1);
            break
          }
        }
      }
    });
  }

  this.requested = function(){
    friendFactory.requested($routeParams.id, function(data){
      _this.requestedFriendship = data;
      console.log("REQUESTED", data);
      var temp = _this.everyone;
      for (var r = 0; r < _this.requestedFriendship.length; r++) {
        for (var e = 0; e < _this.everyone.length; e++) {
          if (_this.requestedFriendship[r]._id == temp[e]._id) {
            _this.everyone.splice(e,1);
            break
          }
        }
      }
    })
  }

  this.acceptRequest = function(her){
    friendFactory.accept(_this.user, her, this.confirmed);
  }

  this.deleteRequest = function(her){
    friendFactory.delete(_this.user, her);
    for (var i = 0; i < _this.pendingFriends.length; i++) {
      if (her._id == _this.pendingFriends[i]._id) {
        _this.pendingFriends.splice(i,1);
        _this.everyone.push(her);
        break;
      }
    }
    for (var i = 0; i < _this.requestedFriendship.length; i++) {
      if (her._id == _this.requestedFriendship[i]._id) {
        _this.requestedFriendship.splice(i,1);
        _this.everyone.push(her);
        break;
      }
    }
  }

  this.friendRequest = function(her){
    friendFactory.request(_this.user, her, this.pending);
  }

  this.requestCall = function(friend){
    socket.emit("requestCall", {"receptionSocket": friend.socket,
                                    "donorSocket": _this.user.socket,
                                    "donorName": _this.user.username
                                });
  }
  // ************************* SOCKETS ****************************

  socket.on("user-id", function(data) {
    $rootScope.$apply(function(){
      for (var onlineIdx = 0; onlineIdx < data.length; onlineIdx++) {
        if (_this.user._id == data[onlineIdx]._id) {
           _this.user.socket = data[onlineIdx].socket;
        } else if (_this.friends.length > 0) {
          for (var idx = 0; idx < _this.friends.length; idx++){
            if (_this.friends[idx]._id == data[onlineIdx]._id) {
              _this.friends[idx].socket = data[onlineIdx].socket;
              _this.friends[idx].online = data[onlineIdx].online;
            }
          }
        }
      }
    })
  });

  socket.on("requestingCall", function(data) {
    $rootScope.$apply(function() {
      notie.confirm(data.donorName + " wants to video call", "Accept", "Decline",function() {
        console.log("Call accepted");
        var chatroomID = data.donorSocket + _this.user.socket;
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
    console.log("Donor received answer");
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
  this.pending();
  this.requested();
  this.confirmed();
})
