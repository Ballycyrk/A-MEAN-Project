var mongoose      = require('mongoose');
var User          = mongoose.model('User');

module.exports ={
  fail: function(req, res){
    req.body.error = "That email is already in use.";
    res.json({ message: req.body.error });
  },
  nolog: function(req, res){
    req.body.error = "Email/Password incorrect.";
    res.json({ message: req.body.error });
  },
  get: function(req, res){
    User.findOne({_id: req.params.id}, function(err, user){
      if (err) {
        res.json(err);
      } else {
        res.json(user);
      }
    });
  },
  index: function(req, res){
    User.find({}, function (err, all){
      if (err) {
        res.json(err);
      } else {
        console.log(all);
        res.json(all);
      }
    });
  }
};


