const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  

  try {
    switch (req.method) {
      case 'POST':
        // console.log('pathname', pathname)
        // console.log('filepath', filepath)
        // console.log('dirname', path.dirname(pathname));
  
        if( path.dirname(pathname) != '.') {
          res.statusCode = 400;
          res.end('Path with dirs are not supported');
          break;
        }
        
        let fileData;

        const fileOut = fs.createWriteStream(filepath);

        req.pipe(new LimitSizeStream({limit: 1e6, encoding: 'utf-8'}))
          .on('error', (err) =>{
            if (err && err.code == 'LIMIT_EXCEEDED'){
              res.statusCode = 413;
              res.end('File is too big'); 
            }
            if (err && err.code != 'ENOENT') {
              throw err;
            } 
          })
          .pipe(fileOut)
          .on('error', (err) => {
            if(err && err.code != 'EEXIST') {
              res.statusCode = 409;
              res.end('File is already exist');
            } else {
              fs.unlink(filepath, (err) => {
                if(err && err.code != 'ENOENT') {
                  throw err;
                } 
              })
            }
          })

        break;
      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(`Unknown error ${error}`); 
  }
});

module.exports = server;
