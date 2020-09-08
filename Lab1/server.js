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
            <h1>Hello World!</h1>
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
        default:
            res.writeHead(400, {'Content-type':'text/plain'});
            res.end("Invalid request");
            break;
    }
}).listen(3000, ()=>console.log("Сервер работает"));