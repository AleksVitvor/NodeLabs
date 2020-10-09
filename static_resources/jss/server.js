const http=require('http');
const { Console } = require('console');

const html=`
    <!doctype>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Первый сервер</title>
        </head>
        
        <body>
            <h3>Hello World!</h3>
        </body>
    </html>
    `;

http.createServer((req, res)=>
{
    switch(req.url)
    {
        case '/':
            res.writeHead(200, {'Content-type':'text/html'});
            res.end(html);
            break;
        case '/hello':
            res.writeHead(200, {'Content-type':'text/html'});
            res.end(`<h1>Hello World!</h1>`);
            break;
        default:
            res.writeHead(400, {'Content-type':'text/plain'});
            res.end("Invalid request");
            break;
    }
}).listen(3000, ()=>console.log("Сервер работает"));