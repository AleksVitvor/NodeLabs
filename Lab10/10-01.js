const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

http.createServer((req, res)=>{
    if(req.method == 'GET' && req.url == '/start'){
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(fs.readFileSync('./10.html'));
    }else{
        res.statusCode=400;
        res.end();
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/start');

let k=0;
const ws = new WebSocket.Server({port:4000, host:'localhost', path:'/ws'});
ws.on('connection', (wss)=>{
    console.log('Socket opened');
    let mess;
    wss.on('message', message =>{
        console.log(`Received message => ${message}`);
        mess = message.toString().substr(13);
    })
    setInterval(()=>{
        wss.send(`10-01-server: ${mess}->${++k}`)
    }, 5000);
    wss.on('close', () => {
        console.log('Socket closed');
    });
})
ws.on('error', (e)=>{console.log('ws server error', e)});
console.log(`ws server: host:${ws.options.host}, port:${ws.options.port}, path:${ws.options.path}`);
