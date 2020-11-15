const WebSocket = require('ws');

let k = 0;
let c = 0;
const ws = new WebSocket.Server({port:4000, host:'localhost', path:'/pingpong'});
ws.on('connection', (wss)=>{
    wss.on('pong', data=>{
        ++c;
    });
    setInterval(()=>{
        ws.clients.forEach(client=>{
            if(client.readyState === WebSocket.OPEN)
                client.send(`11-03-server: ${++k}`);
        });
    }, 15000); 
    setInterval(()=>{
        console.log('count of client: ', c);
        ws.clients.forEach(client=>{
            if(client.readyState === WebSocket.OPEN){
                c = 0;
                client.ping('server:ping');
            }
        });
    }, 5000);
});
ws.on('error', (e)=>{console.log('ws server error', e)});
console.log(`ws server: host:${ws.options.host}, port:${ws.options.port}, path:${ws.options.path}`);
