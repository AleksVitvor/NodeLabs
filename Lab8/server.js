const http = require("http");
const fs = require("fs");
const url=require("url");
const qs = require("querystring"); 
const parseString=require('xml2js').parseString;
const xmlBuilder=require('xmlbuilder');

let count = (obj)=>
{
    let rc='<result>prase error</result>';
    try
    {
        let xmldoc=xmlBuilder.create("responce").att('request', obj.request.$.id);
        let sum=0;
        let str='';
        for(var i=0;i<obj.request.x.length;i++)
        {
            sum+=parseInt(obj.request.x[i].$.value);
        }
        for(var i=0;i<obj.request.m.length;i++)
        {
            str+=obj.request.m[i].$.value;
        }
        xmldoc.ele('sum').att('value', sum)
                .up()
                .ele('concat').att('value', str);
        rc=xmldoc.toString({pretty:true});
    }
    catch(e)
    {
        console.log(e);
    }
    return rc;
}

let server=http.createServer(function(request, response){
    // получаем путь после слеша
    //const filePath = request.url.substr(1);
    const urlRequest=url.parse(request.url, true);
    switch(urlRequest.pathname.split('/')[1])
    {
        case '':
            fs.access("index.html", err => {
                // если произошла ошибка - отправляем статусный код 404
                if(err){
                    response.statusCode = 404;
                    response.end("Resourse not found!");
                }
                else{
                    fs.createReadStream("index.html").pipe(response);
                }
              });
              break;
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
            if (request.method == 'POST') 
            {
                let result='';
                request.on('data', (data)=>
                {
                    result+=data;
                });
                request.on('end', (end)=>
                {
                    result+='<br/>';
                    let o=qs.parse(result);
                    result='';
                    for(let key in o)
                    {
                        result+=`${key} = ${o[key]}<br/>`;
                    }
                    response.writeHead(200, {'Content-type':'text/html; charset=utf-8'});
                    response.write('<h3>URL-параметры</h3>');
                    response.end(result);
                })
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'json':
            if (request.method == 'POST') 
            {
                let result='';
                request.on('data', (data)=>
                {
                    result+=data;
                });
                request.on('end', (end)=>
                {
                    let __comment='';
                    let x_plus_y;
                    let concatination_s_o='';
                    let length_m;
                    let o=JSON.parse(result);
                    __comment=`Ответ. ${o.__comment.substr(8)}`;
                    x_plus_y=o.x+o.y;
                    length_m=o.m.length;
                    concatination_s_o=`${o.o.surname} ${o.o.name}`;
                    response.write(JSON.stringify({
                        _comment: __comment,
                        y_plus_x: x_plus_y,
                        m_length: length_m,
                        concatination_s_o: concatination_s_o
                    }));
                    response.end();
                });
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'xml':
            if (request.method == 'POST') 
            {
                let xmlText='';
                request.on("data", (data)=>
                {
                    xmlText+=data;
                });
                request.on("end", ()=>
                {
                    parseString(xmlText, function(err, result)
                    {
                        if(err)
                        {
                            response.writeHead(400, {'Content-type':'text/plain'});
                            response.end();
                        }
                        else
                        {
                            response.writeHead(200);
                            response.write(count(result));
                            response.end();
                        }
                    })
                });
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'files':
            break;
        case 'upload':
            break;
    }
}).listen(3000, function(){console.log("Server started on 3000 port")});