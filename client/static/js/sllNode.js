var Node = function(user){
  if (user._id)
    this.user = user._id
  else
    this.user = user.user;
  if (user.idx)
    this.fStatus = user.idx;
  else
    this.fStatus = 0;
  this.username = user.username;
  this.next = null;
}

Array.prototype.add = function(value){
  var node = new Node(value);
  if (this[node.fStatus] == null) {
    this[node.fStatus] = node;
  } else {
    var crawler = this[node.fStatus];
    while (crawler.next) {
      crawler = crawler.next;
    }
    crawler.next = node;
  }
}

Array.prototype.update = function(user){
  var runner = this[3];
  while (runner) {
    if (runner.user == user.id) {
      runner.oStatus = user.oStatus;
      break
    } else {
      runner = runner.next
    }
  }
}

Array.prototype.remove = function(user) {
  var runner = this[user.fStatus];
  if (runner.user == user.user) {
    this[user.fStatus] = runner.next;
  } else {
    while (runner.next) {
      if (runner.next.user == user.user) {
        runner.next = runner.next.next;
        break
      } else {
        runner = runner.next
      }
    }
  }
}

Array.prototype.fSort = function(user) {
  var other = this[0];
  var ask   = this[user.fStatus];
  if (ask) {
    while (ask.next) {
      ask = ask.next
    }
  }
  if (other.user == user.user) {
    if (ask)
      ask.next = other;
    else
      this[user.fStatus] = other;
    this[0] = other.next;
    other.next = null;
    if (user.oStatus)
      other.oStatus = user.oStatus;
    other.fStatus = user.fStatus;
  } else {
    while (other.next) {
      if (other.next.user == user.user){
        other.next.fStatus = user.fStatus;
        if (user.oStatus)
          other.next.oStatus = user.oStatus;
        break
      } else {
        other = other.next;
      }
    }
    if (ask)
      ask.next = other.next;
    else
      this[user.fStatus] = other.next;
    var temp = other.next;
    other.next = other.next.next
    temp.next = null;
  }
}

Array.prototype.unpack = function() {
  var result = [];
  for (var idx = 0; idx < 4; idx++) {
    var runner = this[idx]
    while (!!runner) {
      result.push(runner);
      runner = runner.next;
    }
  }
  return result
}
