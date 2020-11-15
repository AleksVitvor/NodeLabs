const net = require('net');

let HOST = '0.0.0.0';
let PORT = 40000;

let k = 0;

let server = net.createServer((sock)=>{
    let sum = 0;
    let clientId = ++k;
    console.log(`Client ${clientId} CONNECTED`);
    
    sock.on('data', (data)=>{
        console.log(data.readInt32LE() + ` - received from client ${clientId}`);
        sum+=data.readInt32LE();
    });
    
    let buf = Buffer.alloc(4);
    let timerId = setInterval(()=>{
        console.log(`Control sum for a client ${clientId}: ${sum}`);
        buf.writeInt32LE(sum, 0); 
        sock.write(buf);
    }, 5000);
    
    sock.on('close', ()=>{
        console.log('Server CLOSED: '+ clientId);
        clearInterval(timerId);
    });
    sock.on('error', ()=>{
        console.log('Server ERROR: '+ clientId);
    });
});

server.on('listening', ()=>{console.log('TCP-server '+HOST+':'+PORT);});
server.on('error', (e)=>{console.log('TCP-server error'+e);});

server.listen(PORT, HOST);