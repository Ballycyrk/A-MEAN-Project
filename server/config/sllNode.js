var Node = (function(){

  function Node(user, socket) {
    if (user._id)
      this.user = user._id
    else
      this.user = user.user;
    this.username = user.username
    this.socket = socket;
    this.next = null;
  }

  Node.prototype.show = function() {
    return this.data;
  }

  return Node;
})();

module.exports = Node;
