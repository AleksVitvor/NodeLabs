const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:4000/download');
ws.on('open', ()=>{
    const duplex = WebSocket.createWebSocketStream(ws,{encoding:'utf-8'});
    let wfile = fs.createWriteStream(`./c_download.txt`);
    duplex.pipe(wfile);
});