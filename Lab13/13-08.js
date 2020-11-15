const net = require('net');

let HOST = '127.0.0.1';
let PORT = process.argv[2]?process.argv[2]:40000;

let client = new net.Socket();
let timerId = null;
let k = 0;

client.connect(PORT, HOST, ()=>{
    console.log('Client CONNECTED: '+client.remoteAddress + ':' + client.remotePort);

    timerId = setInterval(()=>{
        client.write(`${++k}`);
    }, 1000);
    
    setTimeout(()=>{
        clearInterval(timerId);
        client.end();
    }, 20000);
});

client.on('data', (data)=>{console.log('From SERVER: ', data.toString());});

client.on('close', ()=>{console.log('Client CLOSED');});
client.on('error', (e)=>{console.log('Client ERROR: '+e);});
