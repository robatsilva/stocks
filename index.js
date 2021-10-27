var http = require('http');
var fs = require('fs');
var path = require('path');
const cheerio = require('cheerio');
const fundamentalista = require('./app/fundamentalista');
const trade = require('./app/swing-day');
const { time } = require('console');
var request = require('axios');

http.createServer(function (request, response) {
    console.log('request ', request.url);
    filePath = './index.html';
    if(request.url.indexOf('start') > -1){
        trade.init();
    }
    if(request.url.indexOf('fundamentalista') > -1){
        if(request.url.indexOf('update') > -1){
            fundamentalista.init();
        }
        filePath = 'fundamentalista.html';
    }
    // var filePath = '.' + request.url;
    // if (filePath == './') {
    //     filePath = './index.html';
    // }


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

// const _29hours = 29;
// const oneHourInMillisseconds = 60000 * 60;
// const oneDayInMillisseconds = oneHourInMillisseconds * 24;
// const utcHours = new Date().getUTCHours();
// const diff = _29hours - utcHours;
// const threeOfMorning = (utcHours <= 3 ? 6 - utcHours : diff) * oneHourInMillisseconds;

// console.log('utc hour... ', new Date().getUTCHours());
// console.log('will init on... ', new Date(new Date().setTime(new Date().getTime() + threeOfMorning)));
// setTimeout(()=>{
//     console.log('starting ...')
//     trade.init();
//     setInterval(() => {
//         console.log('scheduled 24h from', new Date());
//         trade.init();
//     }, oneDayInMillisseconds)
// }, threeOfMorning)

// setInterval(()=>{
//     console.log('making request', new Date());
//     request.get('https://murmuring-plateau-93423.herokuapp.com/').then(()=>{
//         console.log('request called');
//     });
// }, oneHourInMillisseconds / 2)

// setInterval(()=>{
//     console.log('10 minutes', new Date());
// }, oneHourInMillisseconds / 6)