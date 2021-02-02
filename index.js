var http = require('http');
var fs = require('fs');
var path = require('path');
const cheerio = require('cheerio');
const trade = require('./alpha/swing-day')

http.createServer(function (request, response) {
    console.log('request ', request.url);

    // var filePath = '.' + request.url;
    // if (filePath == './') {
    //     filePath = './index.html';
    // }
    filePath = './index.html';

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            const $ = cheerio.load(content);
            fs.readFile('./analisyHight.txt', (errH, contentH) => {
                $('#hight pre').text(errH ? errH : contentH.toString());
                fs.readFile('./analisyLow.txt', (errL, contentL) => {
                    $('#low pre').text(errL ? errL : contentL.toString());
                    response.end($.html(), 'utf-8');
                })
            })
        }
    });

}).listen(process.env.PORT || 8080);
console.log('initing...')
trade.init();
setInterval(() => {
    console.log('scheduled 24h from', new Date());
    trade.init();
}, 60000 * 60 * 24)
// console.log('finishing');