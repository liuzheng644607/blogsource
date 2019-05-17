function Node(element) {
    this.element = element;
    this.next = null;
}

function List() {
    this.head = new Node("head");
}

List.prototype.add = function() {}

List.prototype.find = function(item) {
    var currNode = this.head;
    while (currNode.element !== item) {
        currNode = currNode.next;
    }
    return currNode;
};

List.prototype.insertAfter = function(newElement, element) {
    var newNode = new Node(newElement);
    var current = this.find(element);
    newNode.next = current.next;
    current.next = newNode;
};

List.prototype.remove = function(item) {

};

List.prototype.display = function() {
    var currNode = this.head;
    while (currNode.next !== null) {
        console.log(currNode.next.element);
        currNode = currNode.next;
    }
};