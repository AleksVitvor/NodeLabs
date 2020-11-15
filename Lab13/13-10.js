const udp = require('dgram');
const PORT = 2000;

const client = udp.createSocket('udp4');

client.on('message',(msg,info)=>{
  console.log('Server DATA: ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
});

let data = Buffer.from('message from client\0');

client.send(data, PORT, 'localhost',(error)=>{
    if(error){
        client.close();
    }
    else{
        console.log('Data sent');
    }
});

var data1 = Buffer.from('hello\t');
var data2 = Buffer.from('world\0');

client.send([data1,data2], PORT, 'localhost',(error)=>{
    if(error){
        client.close();
    }else{
        console.log('Data sent');
    }
});