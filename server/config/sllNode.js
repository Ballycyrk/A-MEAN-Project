var Node = (function(){

  function Node(user, socket) {
    this.user = user._id;
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
