const http = require("http");
const fs = require("fs");
var status='norm';

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
    const filePath = request.url.substr(1);
    switch(filePath)
    {
        case 'html':
            fs.access("D:\\3_Course\\CrossplatformApplications\\NodeLabs\\Lab3\\index.html", err => {
                // если произошла ошибка - отправляем статусный код 404
                if(err){
                    response.statusCode = 404;
                    response.end("Resourse not found!");
                }
                else{
                    fs.createReadStream("D:\\3_Course\\CrossplatformApplications\\NodeLabs\\Lab3\\index.html").pipe(response);
                }
              });
              break;
        case 'status':
            response.statusCode=200;
            response.end(status);
    }
}).listen(3000, function(){console.log("Server started on 3000 port")});