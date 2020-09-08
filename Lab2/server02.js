const http = require("http");
const fs = require("fs");
  
http.createServer(function(request, response){
    console.log(`Запрошенный адрес: ${request.url}`);
    // получаем путь после слеша
    const filePath = request.url.substr(1);
    switch(filePath)
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
        case 'png':
            if(request.method=='GET')
            {
                fs.access("pic.png", fs.constants.R_OK, err => {
                    // если произошла ошибка - отправляем статусный код 404
                    if(err){
                        response.statusCode = 404;
                        response.end("Resourse not found!");
                    }
                    else{
                        fs.createReadStream("pic.png").pipe(response);
                    }
                  });
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'api/name':
            if(request.method=='GET')
            {
                response.writeHead(200, {'Content-type':'text/plain'});
                response.end("Vitvor Alexey");
            }
            else
            {
                response.writeHead(405, {'Content-type':'text/plain'});
                response.end("Invalid http method");
            }
            break;
        case 'xmlhttprequest':
            fs.access("xmlhttprequest.html", err => {
                // если произошла ошибка - отправляем статусный код 404
                if(err){
                    response.statusCode = 404;
                    response.end("Resourse not found!");
                }
                else{
                    fs.createReadStream("xmlhttprequest.html").pipe(response);
                }
              });
            break;
        case 'jquery':
            fs.access("jquery.html", err => {
                // если произошла ошибка - отправляем статусный код 404
                if(err){
                    response.statusCode = 404;
                    response.end("Resourse not found!");
                }
                else{
                    fs.createReadStream("jquery.html").pipe(response);
                }
              });
            break;
        case 'fetch':
            fs.access("fetch.html", err => {
                // если произошла ошибка - отправляем статусный код 404
                if(err){
                    response.statusCode = 404;
                    response.end("Resourse not found!");
                }
                else{
                    fs.createReadStream("fetch.html").pipe(response);
                }
              });
            break;
    }    
}).listen(3000, function(){
    console.log("Server started at 3000");
});