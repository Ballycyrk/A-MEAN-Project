
var mongoose      = require('mongoose');
var Friendship    = mongoose.model('Friendship');
var User          = mongoose.model('User');

module.exports ={
  request: function(req, res){
    var you = req.body.him.user;
    var them = req.body.her.user;
    var her = {
      user: req.body.her.user,
      username: req.body.her.username
    };
    Friendship.find({confirmed: false}, function(err, all){
      for (var i = 0; i < all.length; i++) {
        if (all[i].his.username == you && all[i].her.username == them) {
          res.json({message: "You've already made this request"});
        } else if (all[i].her.username == you && all[i].his.username == them){
          res.json({message: "They've already sent you a request!"});
        }
      }
    })
    var friendReq = new Friendship();
    if (req.body.her.next)
      req.body.her.next = null;
    friendReq.his.username = req.body.him;
    friendReq.her.username = her;
    friendReq.save(function(err, success){
      if (err) {
        res.json(err);
      } else {
        res.json(success);
      }
    })
  },

  pending: function(req, res){
    var pending = Friendship.find({'his.username.user': req.params.id,
                                    confirmed: false},
    function(err, success){
      if (err){
        console.log("error");
        res.json(err);
      } else {
        var asked = [];
        for (var i=0; i < success.length; i++){
          var temp = {};
          temp.user = success[i].her.username.user;
          temp.username = success[i].her.username.username;
          temp.fStatus = 1;
          asked.push(temp);
        };
        res.json(asked);
      }
    });
  },

  requested: function(req, res){
    var requested = Friendship.find({'her.username.user': req.params.id,
                                    confirmed: false},
    function(err, success){
      if (err){
        console.log("REQUEST ERROR", err);
        res.json(err);
      } else {
        var asked = [];
        for (var i=0; i < success.length; i++){
          var temp = {};
          temp.user = success[i].his.username.user;
          temp.username = success[i].his.username.username;
          temp.fStatus = 2;
          asked.push(temp);
        };
        res.json(asked);
      }
    });
  },

  confirm: function(req, res){
    var pending = Friendship.find({ confirmed: true },
    function(err, success){
      if (err){
        console.log("CONFIRMED ERROR", err);
        res.json(err);
      } else {
        var asked = [];
        console.log("********************************");
        console.log(success);
        console.log("********************************");
        for (var i=0; i < success.length; i++){
          var temp = {};
          if (req.params.id == success[i].his.username.user) {
            temp.user = success[i].her.username.user;
            temp.username = success[i].her.username.username;
            temp.fStatus = 3;
            asked.push(temp);
          }
          if (req.params.id == success[i].her.username.user) {
            temp.user = success[i].his.username.user;
            temp.username = success[i].his.username.username;
            temp.fStatus = 3;
            asked.push(temp);
          }
        };
        res.json(asked);
      }
    });
  },

  accept: function(req, res){
    var you = req.body.him.user;
    var them = req.body.her.user;
    Friendship.findOne({'his.username.user': them, 'her.username.user': you}, function(err, fini){
      if (err) {
        console.log("ACCEPT ERROR", err);
        res.json(err);
      } else {
        fini.confirmed = true;
        fini.save();
        res.json(fini.his);
      }
    })
  },

  delete: function(req, res){
    var you = req.body.him.user;
    var them = req.body.her.user;
    Friendship.remove({'his.username.user': you, 'her.username.user': them}, function(err){
      Friendship.remove({'his.username.user': them, 'her.username.user': you}, function(err){
        res.json(req.body.her);
      });
    });
  }
};


