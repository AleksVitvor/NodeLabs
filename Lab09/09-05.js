var http = require('http');

let params = '<request id="28"><x value="1"/><x value="2"/><x value="1"/><m value="a"/><m value="b"/></request>';

let options = {
    host: 'localhost',
    path: '/fifth',
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': 'application/xml',
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