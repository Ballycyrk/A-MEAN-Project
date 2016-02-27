
var mongoose      = require('mongoose');
var Friendship    = mongoose.model('Friendship');
var User          = mongoose.model('User');

module.exports ={
  request: function(req, res){
    var you = req.body.him._id;
    var them = req.body.her._id;
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
    friendReq.his.username = req.body.him;
    friendReq.her.username = req.body.her;
    friendReq.save(function(err, success){
      if (err) {
        res.json(err);
      } else {
        res.json(success);
      }
    })
  },

  pending: function(req, res){
    var pending = Friendship.find({'his.username': req.params.id,
                                    confirmed: false})
    .populate('his.username')
    .populate('her.username')
    .exec(function(err, success){
      if (err){
        res.json(err);
      } else {
        var asked = [];
        for (var i=0; i < success.length; i++){
          asked.push(success[i].her.username);
        };
        res.json(asked);
      }
    });
  },

  requested: function(req, res){
    var requested = Friendship.find({'her.username': req.params.id,
                                    confirmed: false})
    .populate('his.username')
    .populate('her.username')
    .exec(function(err, success){
      if (err){
        console.log("REQUEST ERROR", err);
        res.json(err);
      } else {
        var asked = [];
        for (var i=0; i < success.length; i++){
          asked.push(success[i].his.username);
        };
        res.json(asked);
      }
    });
  },

  confirm: function(req, res){
    var pending = Friendship.find({ confirmed: true })
    .populate('her.username')
    .populate('his.username')
    .exec(function(err, success){
      if (err){
        console.log("CONFIRMED ERROR", err);
        res.json(err);
      } else {
        var asked = [];
        for (var i=0; i < success.length; i++){
          if (req.params.id == success[i].his.username._id) {
            asked.push(success[i].her.username);
          }
          if (req.params.id == success[i].her.username._id) {
            asked.push(success[i].his.username);
          }
        };
        res.json(asked);
      }
    });
  },

  accept: function(req, res){
    var you = req.body.him._id;
    var them = req.body.her._id;
    Friendship.findOne({'his.username': them, 'her.username': you}, function(err, fini){
      if (err) {
        console.log("ACCEPT ERROR", err);
        res.json(err);
      } else {
        fini.confirmed = true;
        fini.save();
        res.json(fini);
      }
    })
  },

  delete: function(req, res){
    var you = req.body.him._id;
    var them = req.body.her._id;
    Friendship.remove({'his.username': you, 'her.username': them}, function(err){
      Friendship.remove({'his.username': them, 'her.username': you}, function(err){
        res.json();
      });
    });
  }
};


