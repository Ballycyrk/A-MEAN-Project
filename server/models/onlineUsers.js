
var head  = null;
var count = 0;
var Node  = require('./../config/sllNode.js');

module.exports = {
  insert: function(user, socket){
    var newNode = new Node(user, socket);
    var insert = true
    if (head == null) {
      head = newNode;
      count++;
    } else if (head.user == user._id) {
      head.socket = socket;
    } else {
      var runner = head;
      while (runner.next) {
        if (runner.next.user == user._id) {
          runner.next.socket = socket;
          insert = false;
        }
        runner = runner.next
      }
      if (insert) {
        runner.next = newNode;
        count++;
      }
    }
  },
  refresh: function(user, socket) {
    var newGuy = {};
    if (head == null) {
      return null;
    } else if (head.user == user._id) {
      head.socket = socket;
      newGuy.user     = head.user;
      newGuy.username = head.username;
    } else {
      var runner = head;
      while (runner) {
        if (runner.user == user._id) {
          runner.socket = socket;
        }
        runner = runner.next
      }
      newGuy.user = runner.user;
      newGuy.username = runner.username;
    }
    return newGuy;
  },
  remove: function(socket) {
    if (head == null) {
      return SinglyLinkedList;
    } else if (head.socket == socket) {
      head = head.next;
    } else {
      var runner = head;
      while (runner && runner.next) {
        if (runner.next.socket == socket) {
          runner.next = runner.next.next;
        }
        runner = runner.next;
      }
    }
    count--;
  },
  findSocket: function(userID) {
    var runner = head;
    while (runner) {
      if (runner.user == userID) {
        return runner.socket;
      } else {
        runner = runner.next;
      }
    }
    return {error: "User not found"}; // return null
  },
  show: function(){
    console.log("COUNT", count);
    console.log("NODES", head);
    return;
  }
};


