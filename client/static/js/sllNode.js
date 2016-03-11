var Node = function(user){
  if (user._id)
    this.user = user._id
  else
    this.user = user.user;
  if (user.fStatus)
    this.fStatus = user.fStatus;
  else
    this.fStatus = 0;
  this.username = user.username;
  this.next = null;
}

Node.prototype.show = function() {
  return this.username;
}

Array.prototype.add = function(value){
  var node = new Node(value);
  if (this[0] == null) {
    this[0] = node;
  } else {
    var crawler = this[0];
    while (crawler.next) {
      crawler = crawler.next;
    }
    crawler.next = node;
  }
}

Array.prototype.fSort = function (user) {
  // if (user.fStatus == 1 || user.fStatus == 2) {
  var other = this[0];
  var ask   = this[user.fStatus];
  // } else {
  //   var other = this[user.fStatus];
  //   var ask   = this[3];
  // }
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
    // if (other.fStatus != 3)
    this[0] = other.next;
    // else
    //   this[user.fStatus] = other.next;
    other.next = null;
    other.fStatus = user.fStatus;
  } else {
    while (other.next) {
      if (other.next.user == user.user){
        other.next.fStatus = user.fStatus;
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
