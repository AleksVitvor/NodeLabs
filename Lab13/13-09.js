const udp = require('dgram');
const PORT = 2000;

let server = udp.createSocket('udp4');

server.bind(PORT);

server.on('message',(msg,info)=>{
    console.log('Client DATA: ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
    
    server.send(`ECHO: ${msg}`, info.port, info.address, (error)=>{
        if(error){
            client.close();
        }else{
            console.log('Data sent');
        }
    });
});

server.on('listening',()=>{
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port: ' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);
});

server.on('error',(err)=>{
    console.log('Error: ' + error); 
    server.close(); 
});

server.on('close',()=>{
  console.log('Socket is closed!');
});
