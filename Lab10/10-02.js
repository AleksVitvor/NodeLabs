const WebSocket = require('ws');

const ws = new WebSocket('ws:/localhost:4000/ws');
let k=0;
let messageInterval;
ws.on('open',()=>{    
    console.log('Socket opened');
    messageInterval = setInterval(()=>{
        ws.send(`10-01-client:${++k}`);
    }, 3000);
    ws.on('message',(message)=>{
        console.log(`${message}`);
    })
    setTimeout(()=>{
        clearInterval(messageInterval);
        ws.close();
    }, 25000);
})
ws.on('close', () => { console.log('Socket closed');});
ws.on('error', (error) => {alert('Error '+ error.message);});