class ProjectCard{
  constructor(title, desc, img, alt, link){
    this.Title = title;
    this.Description = desc;
    this.ImageLocation = img;
    this.Alt = alt;
    this.Link = link;
  }

  toString(){
    return this.Title + "\n" + this.Description + "\n" + this.ImageLocation;
  }

  toHtml(){
    let tmp = '';
    tmp =  '\n' + '<div class="ProjectCards">';
    tmp += '\n' + '<a href = "'+ this.Link +'">';
    tmp += '\n' + '<img class="CardImg" src="' + this.ImageLocation + '" alt="'+this.Alt+'"/>';
    tmp += '\n' + '<p class="CardTitle">' + this.Title + '</p>';
    tmp += '\n' + '<p class="CardContent">'+ this.Description+'</p>';
    tmp += '\n' + '<a/>';
    tmp += '\n' + '</div>';
    return tmp;
  }
}

class WideCard {
  constructor(img, alt, title, desc){
    this.ImageLocation = img;
    this.Alt = alt;
    this.Title = title;
    this.Description = desc;
  }
  toString(){
    let tmp = '';
    tmp += '\n' + 'ImageLocation =' + this.ImageLocation;
    tmp += '\n' + 'Alt ='           + this.Alt;
    tmp += '\n' + 'Title ='         + this.Title;
    tmp += '\n' + 'Description ='   + this.Description;
    return tmp
  }

  toHtml(){
    let tmp = '';
    tmp += '\n' + '<div class="WideCard">';
    if (this.Title != '' && this.Alt != ''){
      tmp += '\n' + '<img class="WideCardImg" src="' + this.ImageLocation + '" alt="[' + this.Alt + ']">';
    }
    tmp += '\n' + '<div class="WideCardContent">';
    tmp += '\n' + '<h1 class="WideCardTitle">' + this.Title + '</h1>';
    tmp += '\n' + '<p class="WideCardDescription">'+ this.Description +'</p>';
    tmp += '\n' + '</div>';
    tmp += '\n' + '</div>';

    return tmp;
  }
}

class NavButton {
    constructor(link,  Info){
        this.Link = link;
        this.Text = Info;
    }

    toString(){
        return this.Link + this.Text;
    }
    toHtml(){
      let tmp =  '<p><a class="menuItemL" href="' + this.Link + '"> ' + this.Text +' </a></p>';
      return '\n<div class="menuItem">\n'+ tmp +'\n</div>';
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
module.exports =  {NavButton, WideCard, ProjectCard, Queue, Stack};