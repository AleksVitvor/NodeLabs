const rpcWSC = require('rpc-websockets').Client;

const ws = new rpcWSC('ws://localhost:4000');

ws.on('open', () => {
    ws.subscribe('Changed!');
    ws.on('Changed!', (f, event) => {
        console.log(`folder: ${f}, event = ${event}`);
    });
});