class Queue {
  constructor() {
    this.queue = [];
  }

  /**
   * 入队列
   * @param {} el 
   */
  enqueue(el) {
    this.queue.push(el);
  }

  dequeue() {
    return this.queue.shift();
  }
}