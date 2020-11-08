var resources='D:\\3_Course\\CrossplatformApplications\\NodeLabs\\static_resources';
var http = require('http');
var url=require('url');
var fs=require('fs');
var path = require("path");
var finder=require('./m0702');

http.createServer(function(request, response){
    const urlRequest=url.parse(request.url, true);
    if(request.method=='GET')
    {
        switch(path.dirname(urlRequest.path).substr(1))
        {
            case '':
                if(path.basename(urlRequest.path)=='favicon.ico')
                    break;
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
            case 'videos':
                var resoucePath=resources+'\\'+path.dirname(urlRequest.path).substr(1)+'\\'+path.basename(urlRequest.path);
                finder.Find(resoucePath, response);
                break;
            case 'pngs':
                var resoucePath=resources+'\\'+path.dirname(urlRequest.path).substr(1)+'\\'+path.basename(urlRequest.path);
                finder.Find(resoucePath, response);
                break;
            case 'csss':
                var resoucePath=resources+'\\'+path.dirname(urlRequest.path).substr(1)+'\\'+path.basename(urlRequest.path);
                finder.Find(resoucePath, response);
                break;
            case 'jss':
                var resoucePath=resources+'\\'+path.dirname(urlRequest.path).substr(1)+'\\'+path.basename(urlRequest.path);
                finder.Find(resoucePath, response);
                break;
            case 'docxs':
                var resoucePath=resources+'\\'+path.dirname(urlRequest.path).substr(1)+'\\'+path.basename(urlRequest.path);
                finder.Find(resoucePath, response);
                break;
            case 'jsons':
                var resoucePath=resources+'\\'+path.dirname(urlRequest.path).substr(1)+'\\'+path.basename(urlRequest.path);
                finder.Find(resoucePath, response);
                break;
            case 'xmls':
                var resoucePath=resources+'\\'+path.dirname(urlRequest.path).substr(1)+'\\'+path.basename(urlRequest.path);
                finder.Find(resoucePath, response);
                break;
            default:
                response.writeHead(404, {'Content-type':'text/plain'});
                response.end("Invalid request path");
                break;
        }
    }
    else
    {
        response.writeHead(405, {'Content-type':'text/plain'});
        response.end("Invalid http method");
    }
}).listen(3000, function(){console.log("Server started on 3000 port")});