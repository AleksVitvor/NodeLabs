var http = require('http');

let options = {
    host: 'localhost',
    path: '/',
    port: 5000,
    method: 'GET'
}
const req = http.request(options, (res)=>{
    console.log('method: ', req.method);
    console.log('response: ', res.statusCode);
    console.log('statusMessage: ', res.statusMessage);
    console.log('remoteAddress: ', res.socket.remoteAddress);
    console.log('remotePort: ', res.socket.remotePort);
    console.log('response headers: ', res.headers);

    let data ='';
    res.on('data', (chunk)=>{
        console.log('data: body: ', data += chunk.toString('utf-8'));
    });
    res.on('end', ()=>{console.log('end: body: ', data);});
});

req.on('error', (e)=>{console.log('error: ', e.message);});
req.end();