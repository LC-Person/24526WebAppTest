const {writeHead, navWrite, writeBody, writeFooter, SecureFileVerify} = require('./ServerTools/pagebuilder.js');
const { createServer } = require('node:http');

const url = require('url');
const path = require('path');
const { stringify } = require('node:querystring');

let hostname = '';
if (false){
let hostname = '127.0.0.1';
}
else{
const hostname = '0.0.0.0';
}

const DEFAULT_CONTENT = 'PAGE';

const port = 3024;

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
      return DEFAULT_CONTENT;
  }
}

const server = createServer((req,res)=>{

    res.statusCode = 200;

    const ParcedURL = url.parse(req.url, true);
    console.log(`parced url ${ParcedURL.path}`)
    contentType = getContent(ParcedURL.path);

    if (contentType != DEFAULT_CONTENT){
      //really want to put '' in secure
      const data = SecureFileVerify(ParcedURL.path)
      if (data != null){
        res.setHeader("Content-Type", contentType);
        res.end(data);
      }
      else { contentType = "yeet";} 
    }
    else
    {
        res.setHeader("Content-Type","text/html"); 
        res.write('<!doctype HTML>\n<html lang="en"\n>');
        
        res.write(writeHead());
        res.write(writeBody(req, ParcedURL.path));
        res.write(writeFooter());
        
        res.end('\n</html>');
        
    }
});

server.listen(port, hostname, ()=>{
    console.log(`server running at https://${hostname}:${port}/`);
});