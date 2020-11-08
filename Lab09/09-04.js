var http = require('http');

let params =  JSON.stringify({
    __comment: "comment",
    x: 1,
    y: 2,
    s: "message",
    m: ["a", "b"],
    o: {surname: "Metla", name:"Polina"}
});

let options = {
    host: 'localhost',
    path: '/fourth',
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': params.length
      }
}
const req = http.request(options, (res)=>{
    console.log('method: ', req.method);
    console.log('response: ', res.statusCode);
    console.log('statusMessage: ', res.statusMessage);

    let data ='';
    res.on('data', (chunk)=>{
        console.log('data: body: ', data += chunk.toString('utf-8'));
    });
});

req.on('error', (e)=>{console.log('error: ', e.message);});
req.write(params);
req.end();