const net = require('net');

let HOST = '127.0.0.1';
let PORT = 40000;

let server = net.createServer();
server.on('connection', (sock)=>{
    console.log('Server CONNECTED: '+sock.remoteAddress + ':' + sock.remotePort);
    sock.on('data', (data)=>{
        console.log('Server DATA: ', data.toString());
        sock.write('ECHO: '+data);
    });
    
    sock.on('close', ()=>{
        console.log('Server CLOSED: '+ sock.remoteAddress+' '+sock.remotePort);
    });
    sock.on('error', ()=>{
        console.log('Server ERROR: '+ sock.remoteAddress+' '+sock.remotePort);
    });
})

server.on('listening', ()=>{console.log('TCP-server '+HOST+':'+PORT);});
server.on('error', (e)=>{console.log('TCP-server error'+e);});

server.listen(PORT, HOST);