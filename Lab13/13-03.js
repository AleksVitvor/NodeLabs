const net = require('net');

let HOST = '0.0.0.0';
let PORT = 40000;

let sum = 0;

let server = net.createServer((sock)=>{
    console.log('Server CONNECTED: '+sock.remoteAddress + ':' + sock.remotePort);
    
    sock.on('data', (data)=>{
        console.log(data, sum);
        sum+=data.readInt32LE();
    });
    
    let buf = Buffer.alloc(4);
    let timerId = setInterval(()=>{
        buf.writeInt32LE(sum, 0); 
        sock.write(buf);
    }, 5000);
    
    sock.on('close', ()=>{
        console.log('Server CLOSED: '+ sock.remoteAddress+' '+sock.remotePort);
        clearInterval(timerId);
    });
    sock.on('error', ()=>{
        console.log('Server ERROR: '+ sock.remoteAddress+' '+sock.remotePort);
    });
});

server.on('listening', ()=>{console.log('TCP-server '+HOST+':'+PORT);});
server.on('error', (e)=>{console.log('TCP-server error'+e);});

server.listen(PORT, HOST);