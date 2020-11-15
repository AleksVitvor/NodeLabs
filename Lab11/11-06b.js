const rpcWSC = require('rpc-websockets').Client;

const ws = new rpcWSC('ws://localhost:4000');
ws.on('open', () => {
    ws.subscribe('B');
    ws.on('B', ()=>{console.log('event B')});
});