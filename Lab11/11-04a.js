const WebSocket = require('ws');

let parm2 = process.argv[2];
console.log('parm2 = ', parm2);

let x = typeof parm2 == 'underfined'?'A':parm2;
const ws = new WebSocket('ws://localhost:4000/json');

ws.on('open', ()=>{
    ws.on('message', mess =>{
        console.log('On message: ', JSON.parse(mess));
    });
    ws.send(JSON.stringify({client:x, timestamp:new Date().toISOString()}));
});