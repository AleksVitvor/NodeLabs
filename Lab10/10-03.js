const WebSocket = require('ws');

let k=0;
const ws = new WebSocket.Server({port:5000, host:'localhost', path:'/broadcast'});
ws.on('connection', (wss)=>{
    wss.on('message', message =>{
        ws.clients.forEach(client=>{
            if(client.readyState === WebSocket.OPEN)
                client.send('server: ' + message);
        });
    });
});
ws.on('error', (e)=>{console.log('ws server error', e)});
console.log(`ws server: host:${ws.options.host}, port:${ws.options.port}, path:${ws.options.path}`);
