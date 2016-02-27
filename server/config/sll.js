var Node = (function(){

  function Node(data) {
    this.data = data;
    this.next = null;
  }

  Node.prototype.show = function() {
    return this.data;
  }

  return Node;
})();

module.exports = Node;


var SinglyLinkedList = (function(){

  function SinglyLinkedList(){
      // linked list has a dummy first element
      this.head  = null;
      this.count = 0;
    }

    SinglyLinkedList.prototype.find = function(element) {
      var currentNode = this.head;
      while(currentNode !== null && currentNode.element !== element) {
        currentNode = currentNode.next;
      }
      return currentNode;
    }

    SinglyLinkedList.prototype.insert = function (newElement) {
      var newNode = new Node(newElement);
      var current = this.head;
      newNode.next = current.next;
      current.next = newNode;
    }

    SinglyLinkedList.prototype.remove = function(element) {
      var previousNode = this.findPrevious(element);
      if(previousNode.next !== null) {
        previousNode.next = previousNode.next.next;
      }
    }

    return SinglyLinkedList
  })();

module.exports = SinglyLinkedList;


