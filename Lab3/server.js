const http = require("http");
const fs = require("fs");
const url=require("url");
const {
    performance,
    PerformanceObserver
  } = require('perf_hooks');
var status='norm';

// var time=performance.now();

let factorial=(m)=>
{
    var n = parseInt(m);
    return (n < 0 || m != n) ? NaN : (n == 0 ? 1 : n * factorial(n - 1));
}
function Fact(n, cb) {
    this.fn=n;
    this.ffact=factorial;
    this.fcb=cb;
    this.calc=()=>{process.nextTick(()=>{this.fcb(null, this.ffact(this.fn));});}
}
function Fact1(n, cb)
{
    this.fn=n;
    this.ffact=factorial;
    this.fcb=cb;
    this.calc=()=>{setImmediate(()=>{this.fcb(null, this.ffact(this.fn));});}
}

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', ()=>{
    let chunk=null;
    while((chunk=process.stdin.read())!=null)
    {
        if(chunk.trim()=='norm' 
            || chunk.trim()=='stop' 
            || chunk.trim()=='test' 
            || chunk.trim()=='idle')
            {
                status=chunk.trim();
            }
        else if(chunk.trim()=='exit')
        {
            process.exit();
        }
        else
        {
            process.stdout.write("Invalid status\n");
            process.stdout.write('\n');
        }
        process.stdout.write("Status is "+status);
        process.stdout.write('\n');
    }
})

http.createServer(function(request, response){
    // получаем путь после слеша
    //const filePath = request.url.substr(1);
    const urlRequest=url.parse(request.url, true);
    switch(urlRequest.pathname.substr(1))
    {
        case 'html':
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
        case 'status':
            response.statusCode=200;
            response.end(status);
        case 'fact':
            if(request.method=='GET')
            {
                k=parseInt(urlRequest.query.k);
                var time=performance.now();
                var fact=factorial(k);
                time=performance.now()-time;
                time=parseInt(time*1000);
                response.writeHead(200, {'Content-type':'application/json'});
                response.end(JSON.stringify({t:time, k:k, fact:fact}));
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'factall':
            if(request.method=='GET')
            {
                fs.access("factorial.html", err => {
                    // если произошла ошибка - отправляем статусный код 404
                    if(err){
                        response.statusCode = 404;
                        response.end("Resourse not found!");
                    }
                    else{
                        fs.createReadStream("factorial.html").pipe(response);
                    }
                  });
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'factorial-with-tick':
            if(request.method=='GET')
            {
                fs.access("factorial4.html", err => {
                    // если произошла ошибка - отправляем статусный код 404
                    if(err){
                        response.statusCode = 404;
                        response.end("Resourse not found!");
                    }
                    else
                    {
                        fs.createReadStream("factorial4.html").pipe(response);
                    }
                });
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'factorial-with-setImmediate':
            if(request.method=='GET')
            {
                fs.access("factorial5.html", err => {
                    // если произошла ошибка - отправляем статусный код 404
                    if(err){
                        response.statusCode = 404;
                        response.end("Resourse not found!");
                    }
                    else
                    {
                        fs.createReadStream("factorial5.html").pipe(response);
                    }
                });
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'factSetImmediate':
            if(request.method=='GET')
            {
                k=parseInt(urlRequest.query.k);
                var res=0;
                var time=performance.now();
                var fact=new Fact1(k, (err, result)=>
                {
                    time=performance.now()-time;
                    time=parseInt(time*1000);
                    response.writeHead(200, {'Content-type':'application/json'});
                    response.end(JSON.stringify({t:time, k:k, fact:result}));
                });
                fact.calc();                
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'factTick':
            if(request.method=='GET')
            {
                k=parseInt(urlRequest.query.k);
                var res=0;
                var time=performance.now();
                var fact=new Fact(k, (err, result)=>
                {
                    time=performance.now()-time;
                    time=parseInt(time*1000);
                    response.writeHead(200, {'Content-type':'application/json'});
                    response.end(JSON.stringify({t:time, k:k, fact:result}));
                });
                fact.calc();                
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
            
    }
}).listen(3000, function(){console.log("Server started on 3000 port")});