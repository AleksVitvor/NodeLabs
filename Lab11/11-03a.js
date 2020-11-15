const WebSocket = require('ws');

let parm2 = process.argv[2];

console.log('parm2 = ', parm2);

let prfx = typeof parm2 == 'underfined'?'A':parm2;
const ws = new WebSocket('ws://localhost:4000/pingpong');

ws.on('open', ()=>{
    ws.on('pong', data =>{
        console.log(`on pong => ${data.toString()}`)
    });
    ws.on('message', mess =>{
        console.log(`server: ${mess.toString()}`)
    })
    setInterval(()=>{
        ws.ping('client: ping');
    }, 5000);
});