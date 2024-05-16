const {GlobalContent} = require('./Globals.js');
const fs = require('fs');
const path = require('path');

CONTENT = new GlobalContent()

//"Secure"
function SecureFileVerify(filepath){
    parcedPath = filepath.split('/')
    if(parcedPath[1] == "Public")
    {
      //We navigate back 1 space since this is the Server tools folder
      if (fs.existsSync(path.join(__dirname,'../',filepath))){
        try{
          data = fs.readFileSync(path.join(__dirname,'../',filepath));
          //console.log(data)
          return data;
        }
        catch (err){
          console.error("file read error", err)
          return null;
        }
      }
    }
    else{
        console.log("File bypass catch")
    }
    
    console.log("File not found: {" +__dirname+filepath+"}")
    return null;;
  }

function writeHead(){
    head = '<meta charset="utf-8"/>\n<title>CoolPage</title>\n<link href="/Public/CSSFiles/InterestingCSS.css" rel="stylesheet"/>'
    return '<head>\n'+head+'\n</head>'
}

function navWrite () {
    temp= null;
    tempstr= ''
    NavHtml = '<div class="Nav">\n';
    NavHtml += '<hr class="horizontal-nav"/>\n'

    for (i = 0; i< CONTENT.NavStack.length; i++){
        temp = CONTENT.NavStack[i];
        NavHtml += temp.toHtml();
    }
    NavHtml+="\n</div>"
    return NavHtml;
}

function writeBookmark(CurrentPage){
  let tmp = '';
  tmp += '\n' +'<div class="LeftBar">';
  tmp += '\n' +'<div class="leftdisplay">';
  tmp += '\n' +'<p>Item 1 ertyuiop[puytrertyuiop;lkjuytrertyuiopoiuytredrftyuiopoiuytrtyuiop[poiuytyuiop[][poiuytrtyuiop[poiuyt5r4rtyuiopoiuytrtyuiopouytrertyuiop</p>';
  tmp += '\n' +'<p>Item 2</p>';
  tmp += '\n' +'<p>Item 3</p>';
  tmp += '\n' +'<p>Item 4</p>';
  tmp += '\n' +'</div>';
  tmp += '\n' +'</div>';
  return tmp
}

function writeBody(req, url){
    body = navWrite()
    console.log("body{" + url+"}")
    switch(url){
      case ("/"):
      case("/home"):
      case ("/Home"):
        body += SecureFileVerify('/Public/pages/Home.html');
        break;
      case ("/AboutMe"):
        //body += SecureFileVerify('/Public/pages/AboutMe.html');
        body += '\n' + writeBookmark('');
        body += '\n' + '<hr class="vertical-nav"/>';
        body += '\n' + '<div class="Content">'
        body += '\n' + '<div class="ContentTitle">'
        body += '\n' + '<h1>Hello World!</h1>'
        body += '\n' + '<p>Welcome to my humble website, I am currently working on improving it in different ways, anyhow here is a required "About me" page that every website must have: </p>'
        body += '\n' + '</div>';
        body += CONTENT.wideCards['30s'].toHtml();
        body += CONTENT.wideCards['Capable'].toHtml();
        for (i =0; i< CONTENT.ProjectCards.length; i++)
        {
          body += '\n' + CONTENT.ProjectCards[i].toHtml();
        }
        body += '\n' + '</div>';
        break;
      case ("/Blog"):
        body += SecureFileVerify('/Public/pages/BlogHome.html');
        //body += '\n' + writeBookmark();
        //body += '\n' + writeBookmark();
        //body += '\n' + writeBookmark();
        break;
      default:  
        body += '<div class="warning"><h1>404 Page</h1><p>Navigation must have gone wrong, we seem to be adrift!</p></div>';
        body += '<div class="TextButon"><p><a class="menuItemL" href="' + '/home' + '"> ' + 'Take me back to civilization'+' </a></p></div>';
      }
    return "<body>\n" + body + "\n</body>"
}
function writeFooter(){
    foot = ""
    return "<footer>\n" + foot + "\n</footer>"
}


module.exports =  {writeHead, navWrite, writeBody, writeFooter, SecureFileVerify};