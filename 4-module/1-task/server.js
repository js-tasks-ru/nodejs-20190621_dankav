const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const ROOT = `${__dirname}/files`;

server.on('request', (req, res) => {
  const pathname = path.normalize(url.parse(req.url).pathname.slice(1));

  const filepath = path.join(__dirname, 'files', pathname);
  // console.log('Got request', req.url);
  try {
    switch (req.method) {
      case 'GET':
        if(~filepath.indexOf('\0')){
          res.statusCode = 500;
          res.end('Bad Request');
          break;
        }
  
        // console.log('pathname', pathname)
        // console.log('filepath', filepath)
        // console.log('dirname', path.dirname(pathname));
  
        if( filepath.indexOf(ROOT) != 0 ){
          res.statusCode = 404;
          res.end('File not found');
          break;
        }
  
        if( path.dirname(pathname) != '.') {
          res.statusCode = 400;
          res.end('Path with dirs are not supported');
          break;
        }
        
        fs.stat(filepath, (err, stats) =>{
          if( err || !stats.isFile()) {
            res.statusCode = 404;
            res.end('File not found');
            return;
          }

          const file = fs.createReadStream(filepath);
          file.pipe(res);
          file.on('end', ()=>{
            // console.log('File sended')
            res.statusCode = 200;
            res.end('Here you are!'); 
          });
        });

        break;
      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  } catch (error) {
    res.statusCode = 500;
    res.end('Unknown error'); 
  }
 
});

module.exports = server;
