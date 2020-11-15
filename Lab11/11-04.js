const WebSocket = require('ws');

let k=0;
let mess;
const ws = new WebSocket.Server({port:4000, host:'localhost', path:'/json'});
ws.on('connection', (wss)=>{
    wss.on('message',data=>{
        mess  = JSON.parse(data);
        console.log('On message: ', mess);
        wss.send(JSON.stringify({server:++k, client:mess.client, timestamp:new Date().toISOString()}));
    });
});
ws.on('error', (e)=>{console.log('ws server error', e)});
console.log(`ws server: host:${ws.options.host}, port:${ws.options.port}, path:${ws.options.path}`);
