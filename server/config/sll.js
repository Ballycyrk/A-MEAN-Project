
var Node             = require('./sllNode.js');
var SinglyLinkedList = (function(){

  function SinglyLinkedList(){
      // linked list has a dummy first element
      this.head  = null;
      this.count = 0;
    }

    // SinglyLinkedList.prototype.find = function(node) {
    //   var currentNode = this.head;
    //   while(currentNode !== null && currentNode.user !== user) {
    //     currentNode = currentNode.next;
    //   }
    //   return currentNode;
    // }

    SinglyLinkedList.prototype.insert = function (user, socket) {
      var newNode = new Node(user, socket);
      var insert = true
      if (this.head == null) {
        this.head = newNode;
        this.count++;
      } else if (this.head.user == user) {
        this.head.socket = socket;
      } else {
        var runner = this.head;
        while (runner.next) {
          if (runner.next.user == user) {
            runner.next.socket = socket;
            insert = false;
          }
          runner = runner.next
        }
        if (insert) {
          runner.next = newNode;
          this.count++;
        }
      }
    }

    SinglyLinkedList.prototype.remove = function(socket) {
      if (this.head == null) {
        return SinglyLinkedList;
      } else if (this.head.socket == socket) {
        this.head = this.head.next;
      } else {
        var runner = this.head;
        while (runner.next) {
          if (runner.next.socket == socket) {
            runner.next = runner.next.next;
          }
          runner = runner.next;
        }
      }
      this.count--;
    }

    SinglyLinkedList.prototype.findSocket = function(userID) {
      var runner = this.head;
      while (runner) {
        if (runner.user == userID) {
          return runner.socket;
        } else {
          runner = runner.next;
        }
      }
      return {error: "User not found"};
    }

    return SinglyLinkedList
  })();

module.exports = SinglyLinkedList;


