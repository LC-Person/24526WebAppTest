
const {ButtonInformation, Queue, Stack} = require('./utils.js');
const { createServer } = require('node:http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { stringify } = require('node:querystring');

if (false){
const hostname = '127.0.0.1';
}
else{
const hostname = '0.0.0.0';
}

const port = 3024;

function navWrite () {
    content = new Stack;
    content.push(new ButtonInformation("/Blog","Blog Area"));
    content.push(new ButtonInformation("/AboutMe","About Me"));
    content.push(new ButtonInformation("/Home","Home"));
    temp= null;
    tempstr= ''
    NavHtml = '<div class="Nav">\n';

    while (!content.isEmpty()){
        temp = content.pop();
        tempstr='<p><a class="menuItemL" href="' + temp.Link + '"> ' + temp.Text +' </a></p>';
        NavHtml =NavHtml+'<div class="menuItem">\n'+tempstr+'\n</div>';
    }
    NavHtml+="\n</div>"
    return NavHtml;
}

function writeHead(){
    head = '<meta charset="utf-8"/>\n<title>CoolPage</title>\n<link href="/Public/CSSFiles/InterestingCSS.css" rel="stylesheet"/>'
    return '<head>\n'+head+'\n</head>'
}

function writeBody(req, url){
    body = navWrite()
    console.log("body{" + url+"}")
    switch(url){
      case ("/"):
      case ("/Home"):
        body += SecureFileVerify('/Public/pages/Home.html');
        break;
      case ("/AboutMe"):
        body += SecureFileVerify('/Public/pages/AboutMe.html');
        break;
      case ("/Blog"):
        body += SecureFileVerify('/Public/pages/BlogHome.html');
        break;
      default:  
        body += '<div class="warning"><h1>404 Page</h1><p>Navigation must have gone wrong, we seem to be adrift!</p></div>';
        body += '<div class="TextButon"><p><a class="menuItemL" href="' + '/home/' + '"> ' + 'Take me back to civilization'+' </a></p></div>';
      }
    return "<body>\n" + body + "\n</body>"
}
function writeFooter(){
    foot = ""
    return "<footer>\n" + foot + "\n</footer>"
}

function getContent(filepath){
  extname = path.extname(filepath);
  switch (extname) {
    case ('.txt'):
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'yeet';
  }
}
function SecureFileVerify(filepath){
  parcedPath = filepath.split('/')
  if(parcedPath[1] == "Public")
  {
    if (fs.existsSync(path.join(__dirname,filepath))){
      try{
        data = fs.readFileSync(path.join(__dirname,filepath));
        //console.log(data)
        return data;
      }
      catch (err){
        console.error("file read error", err)
        return null;
      }
      
    }
  }
  
  console.log("File not found: {" +__dirname+filepath+"}")
  return null;;
}

const server = createServer((req,res)=>{

    res.statusCode = 200;
    console.log(req.url)

    const ParcedURL = url.parse(req.url, true);
    contentType = getContent(ParcedURL.path);
    //const filePath = path.join(__dirname, 'public', ParcedURL.path);

    if (contentType != "yeet"){
      //send a specific file
      temp = SecureFileVerify(ParcedURL.path)
      if (temp != null){
        res.setHeader("Content-Type", stringify(contentType));
        res.end(temp);
      }
      else { contentType = "yeet";} 
    }
    if (contentType == "yeet") {
        res.setHeader("Content-Type","text/html");
        //send html
        res.write('<html lang="en"\n>');
        //write head
        res.write(writeHead());
        //Write body
        res.write(writeBody(req, ParcedURL.path));
        //Write footer
        res.write(writeFooter());
        
        res.end('\n</html>');
      
    }
});

server.listen(port, hostname, ()=>{
    console.log(`server running at https://${hostname}:${port}/`);
});