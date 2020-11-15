const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({port:4000, host:'localhost'});

server.register('A', ()=>{console.log('notify A')});
server.register('B', ()=>{console.log('notify B')});
server.register('C', ()=>{console.log('notify C')});

console.log('rpcWSS')