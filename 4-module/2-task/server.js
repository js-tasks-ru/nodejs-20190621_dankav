const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  

  switch (req.method) {
    case 'POST':
  
      if( path.dirname(pathname) != '.') {
        res.statusCode = 400;
        res.end('Path with dirs are not supported');
        return;
      }
        
      const fileOut = fs.createWriteStream(filepath, { flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: 1048576, encoding: 'utf-8'});


        // req
        //   .on('aborted', () => {
        //     fs.unlink(filepath);
        //     res.statusCode = 501;
        //     res.end('Connection was lost');
        //   })
        //   .pipe(limitStream)
        //   .on('error', (err) =>{
        //     if (err && err.code == 'LIMIT_EXCEEDED'){
        //       res.statusCode = 413;
        //       res.end('File is too big'); 
        //       fs.unlink(filepath);
        //     }
        //   })
        //   .pipe(fileOut)
        //   .on('error', (err) => {
        //     if(err && err.code == 'EEXIST' ) {
        //       res.statusCode = 409;
        //       res.end('File is already exist');
        //     } 
        //   })
        //   .on('close', () =>{
        //     res.statusCode = 201;
        //     res.end('File created');
        //   });
        
      req.pipe(limitStream).pipe(fileOut);
      req.on('aborted', () => {
          fs.unlink(filepath);
          res.statusCode = 501;
          res.end('Connection was lost');
        });

      limitStream.on('error', (err) =>{
        if (err && err.code == 'LIMIT_EXCEEDED'){
          res.statusCode = 413;
          res.end('File is too big'); 
          fs.unlink(filepath);
        }
      });

      fileOut.on('error', (err) => {
        if(err && err.code == 'EEXIST' ) {
          res.statusCode = 409;
          res.end('File is already exist');
        } 
      });

      fileOut.on('close', () =>{
        res.statusCode = 201;
        res.end('File created');
      });

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
