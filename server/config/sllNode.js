var Node = (function(){

  function Node(user, socket) {
    this.user = user;
    this.socket = socket;
    this.next = null;
  }

  Node.prototype.show = function() {
    return this.data;
  }

  return Node;
})();

module.exports = Node;
