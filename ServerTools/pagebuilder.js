const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

function SecureFileVerify(filepath){
  console.log(`'[${filepath}]'`)
    parcedPath = filepath.split('/')
    if(parcedPath[1] == "Public")
    {
      //We navigate back 1 space since this is the Server tools folder
      if (fs.existsSync(path.join(__dirname,'../',filepath))){
        try{
          data = fs.readFileSync(path.join(__dirname,'../',filepath));
          return data;
        }
        catch (err){
          console.error("file read error", err)
          return fs.readFileSync(path.join(__dirname,'../','/Public/PageRoot/Other/404.html'));
        }
      }
    }
    else{
        console.log("File bypass catch")
    }
    
    console.log("File not found: {" +__dirname+filepath+"}")
    return '<div><h1>404 page not found</h1><p>the particular item you requested was not found</p></div>';
  }

function writeHead(){
  return SecureFileVerify('/Public/PageRoot/Other/head.html')
}

function navWrite () {
  return SecureFileVerify('/Public/PageRoot/Other/Nav.html');
}
function writeFooter(){
  return SecureFileVerify('/Public/PageRoot/Other/footer.html');
}


function writeBody(req, url){
  url = url.toLowerCase()  
  
  let body = '';
  body =  '<body>'+ navWrite()
  body += "<div class='Content'>"

  console.log("body{" + url+"}")
  switch(url){
    case ("/"):
    case ('/home'):
      body += SecureFileVerify('/Public/PageRoot/Home/HomeTemplate.html');
      break;
    case ("/about"):
      body += SecureFileVerify('/Public/PageRoot/About/back.html')
      break;
      case ("/blog"):
      body += SecureFileVerify('/Public/PageRoot/Blog/BlogHome.html')
      break;
    case ("/blog/blogs/helloworld"):
      body += SecureFileVerify('/Public/PageRoot/Blog/Blogs/HelloWorld.html');
      break;
    case ("/games"):
      body+= SecureFileVerify('/Public/PageRoot/Games/GamesHome.html')
      break
    default:  
      body += SecureFileVerify('/Public/PageRoot/Other/404.html')
    }
  body += '</div></body>'
  return body 
}


module.exports =  {writeHead, navWrite, writeBody, writeFooter, SecureFileVerify};