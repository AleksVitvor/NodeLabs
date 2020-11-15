const net = require('net');

let HOST = '0.0.0.0';
let PORT1 = 40000;
let PORT2 = 50000;

let h = (n)=>{return (sock)=>{
    console.log(`CONNECTED ${n}: `+sock.remoteAddress + ':' + sock.remotePort);
    
    sock.on('data', (data)=>{
        console.log(`DATA ${n}:` + data.toString());
        sock.write(`ECHO ${n}:` + data);
    });
    
    sock.on('close', ()=>{
        console.log(`CLOSED ${n}: `+ sock.remoteAddress+' '+sock.remotePort);
    });
}};

net.createServer(h(PORT1)).listen(PORT1, HOST).on('listening', ()=>{console.log('TCP-server '+HOST+':'+PORT1);});

net.createServer(h(PORT2)).listen(PORT2, HOST).on('listening', ()=>{console.log('TCP-server '+HOST+':'+PORT2);});
