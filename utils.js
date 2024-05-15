class ButtonInformation {
    constructor(link,  Info){
        this.Link = link;
        this.Text = Info;
    }
    toString(){
        return this.Link + this.Text;
    }
}

class Stack{
    constructor(){
        this.items = [];
    }

    push(item){
        this.items.push(item);
    }

    pop(){
        if (this.items.length == 0){ return null; }
        else { return this.items.pop(); }
    }
    peek(){
        
        if (this.items.length == 0){ return null; }
        else { return this.items[this.items.length -1]; }
    }
    isEmpty(){
        if(this.items.length == 0) { return true; }
        else { return false; }
    }
    size(){
        return this.items.length
    }

}

class Queue {
    constructor() {
      this.items = [];
    }
  
    enqueue(item) {
      this.items.push(item);
    }
  
    dequeue() {
      if (this.isEmpty()) {
        return null;
      } else {
        return this.items.shift();
      }
    }
  
    peek() {
      if (this.isEmpty()) {
        return null;
      } else {
        return this.items[0];
      }
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  
    size() {
      return this.items.length;
    }
  }
module.exports =  {ButtonInformation, Queue, Stack};