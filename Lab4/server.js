var http = require('http');
var url=require('url');
var fs=require('fs');
var data=require('./04-02');

var db=new data.DB();

db.on('GET', (request, response)=>{response.end(JSON.stringify(db.get()));});
db.on('POST', (request, responce)=>
{
    request.on('data', data=>
    {
        let r=JSON.parse(data);
        db.post(r);
        responce.end(JSON.stringify(r));
    });
});
db.on('PUT', (request, responce)=>
{
    request.on('data', data=>
    {
        let r=JSON.parse(data);
        db.update(r);
        responce.end(JSON.stringify(db.get()));
    });
});
db.on('DELETE', (request, responce)=>
{
    var urlRequest=url.parse(request.url, true);
    let id=parseInt(urlRequest.query.id);
    responce.end(JSON.stringify(db.remove(id)));
});

http.createServer(function(request, response){
    // получаем путь после слеша
    //const filePath = request.url.substr(1);
    const urlRequest=url.parse(request.url, true);
    switch(urlRequest.pathname.substr(1))
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
        case 'api/db':
            db.emit(request.method, request, response);
            break;
    }
}).listen(3000, function(){console.log("Server started on 3000 port")});