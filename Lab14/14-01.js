let http = require('http');
let url = require('url');
let fs = require('fs');

const handler = require('./handler');

let server = http.createServer((request, response)=>{
    let parsedUrl = url.parse(request.url, true);
    let pathUrls = parsedUrl.pathname.split('/');

    if (parsedUrl.pathname === '/') {
        let html = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(html);
    }
    if (pathUrls[1] === 'api') {        
        let object = pathUrls[2];
        if(request.method == 'GET'){
            handler.selectHandler(request, response, object);
        }
        if(request.method == 'POST'){            
            handler.insertHandler(request, response, object);
        }
        if(request.method == 'PUT'){            
            handler.updateHandler(request, response, object);
        }
        if(request.method == 'DELETE'){     
            let id = pathUrls[3];
            handler.deleteHandler(request, response, object, id);
        }
    }
}).listen(3000);

console.log('Server running at http://localhost:3000/');











// const express = require('express');
// const bodyParser = require('body-parser');

// const handler = require('./handler');

// const app = express();

// app.use(bodyParser.json());

// app.get('/', (request, response) => { response.sendFile(__dirname + '/index.html');});
// app.get('/api/:objects', handler.selectHandler);
// app.post('/api/:objects', handler.insertHandler);
// app.put('/api/:objects', handler.updateHandler);
// app.delete('/api/:objects/:id', handler.deleteHandler);

// app.listen(3000, () => {
//     console.log('Server running at http://localhost:3000/');
// });
