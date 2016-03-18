
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
    console.log("REFRESH", user);
    var newGuy = {};
    if (head == null) {
      return null;
    } else if (head.user == user._id) {
      head.socket     = socket;
      newGuy.user     = head.user;
      newGuy.username = head.username;
    } else {
      var runner = head;
      while (runner) {
        if (runner.user == user._id) {
          runner.socket = socket;
          newGuy.user = runner.user;
          newGuy.username = runner.username;
          break;
        }
        runner = runner.next
      }
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
      if (runner.user == userID && runner.socket) {
        return runner.socket;
      } else {
        runner = runner.next;
      }
    }
    // return {error: "User not found"}; // return null
    return false;
  },
  disconnect: function(socket) {
    var runner = head;
    while (runner) {
      if (runner.socket == socket) {
        runner.socket = null;
        return runner.user;
      } else {
        runner = runner.next;
      }
    }
    // return {error: "User not found"}; // return null
    return false;
  },
  show: function(){
    console.log("COUNT", count);
    console.log("NODES", head);
    return;
  }
};


