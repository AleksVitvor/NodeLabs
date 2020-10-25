const http = require("http");
const fs = require("fs");
const url=require("url");

let server=http.createServer(function(request, response){
    // получаем путь после слеша
    //const filePath = request.url.substr(1);
    const urlRequest=url.parse(request.url, true);
    switch(urlRequest.pathname.split('/')[1])
    {
        case 'connection':
            if(request.method=='GET')
            {
                if(request.url.includes("set"))
                {
                    server.keepAliveTimeout=parseInt(urlRequest.query.set);
                }
                response.writeHead(200, {'Content-type':'text/plain'});
                response.end(server.keepAliveTimeout.toString());
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'headers':
            if(request.method=='GET')
            {
                response.setHeader('custom', 'CustomHeader');
                response.end(JSON.stringify({
                    requestHeaders: request.headers,
                    responseHeaders: response.getHeaders()
                }));    
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'parameter':
            if(request.method=='GET')
            {
                if((typeof url.parse(request.url, true).query.x == 'undefined'
                || typeof url.parse(request.url, true).query.y == 'undefined')
                &&
                (typeof urlRequest.pathname.split('/')[2] == 'undefined'
                || typeof urlRequest.pathname.split('/')[3] == 'undefined'))
                {
                    response.writeHead(400, {'Content-type':'text/plain'});
                    response.end('Error invalid input');
                }
                else
                {
                    let x;
                    let y;
                    if(request.url.includes('?'))
                    {
                        x = Number(url.parse(request.url, true).query.x);
                        y = Number(url.parse(request.url, true).query.y);
                    }
                    else
                    {
                        x=parseInt(urlRequest.pathname.split('/')[2]);
                        y=parseInt(urlRequest.pathname.split('/')[3]);
                    }
                    response.end(JSON.stringify({
                        sum: x+y,
                        dec: x-y,
                        mult: x*y,
                        div: x/y
                    })); 
                }
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'close':
            if(request.method=='GET')
            {
                response.end('server will stop in 10 seconds');
                    timerStat = setTimeout(() => {
                        console.log("stopped serv");
                        server.close();
                        exit();
                    }, 10000);
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'socket':
            if(request.method=='GET')
            {
                response.end(JSON.stringify({'Client ip:' : request.connection.remoteAddress,
                        'Client port:' : request.connection.remotePort,
                        'Server ip:' : request.connection.localAddress,
                        'Server port:' :  request.connection.localPort
                    }));
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'req-data':
            if(request.method=='GET')
            {
                let data = [];
                    request.on('data', chunk => data.push(chunk));
                    request.on('end', () =>
                    {
                        console.log(data);
                        response.end();
                    });
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'resp-status':
            if(request.method=='GET')
            {
                response.writeHead(urlRequest.query.code, {'Content-type':'text/plain'});
                response.end(urlRequest.query.mess);
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'formparameter':
            break;
        case 'json':
            break;
        case 'xml':
            break;
        case 'files':
            break;
        case 'upload':
            break;
    }
}).listen(3000, function(){console.log("Server started on 3000 port")});