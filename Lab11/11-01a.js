const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:4000/upload');
ws.on('open', ()=>{
    const duplex = WebSocket.createWebSocketStream(ws,{encoding:'utf-8'});
    let rfile = fs.createReadStream(`./c_upload.txt`);
    rfile.pipe(duplex);
});