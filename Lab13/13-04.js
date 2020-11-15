const net = require('net');

let HOST = '127.0.0.1';
let PORT = 40000;


let client = new net.Socket();
let buf = Buffer.alloc(4);
let timerId = null;

let k = 0;

client.connect(PORT, HOST, ()=>{
    console.log('Client CONNECTED: '+client.remoteAddress + ':' + client.remotePort);

    timerId = setInterval(()=>{
        client.write((buf.writeInt32LE(k++, 0), buf));
    }, 1000);
    
    setTimeout(()=>{
        clearInterval(timerId);
        client.end();
    }, 20000);
});

client.on('data', (data)=>{console.log('From SERVER: ', data.readInt32LE());});

client.on('close', ()=>{console.log('Client CLOSED');});
client.on('error', (e)=>{console.log('Client ERROR: '+e);});