var http = require('http');
var url=require('url');
var fs=require('fs');
var sendmail=require('sendmail')({silent:true});
var mailsender=require('./m0602');

http.createServer(function(request, response){
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
        case 'send':
            let message=urlRequest.query.message;
            let sender=urlRequest.query.sender;
            let receiver=urlRequest.query.receiver;
            sendmail({
                from: sender,
                to: receiver,
                html: message
            }, function(err, reply) {
                console.log(err && err.stack);
                console.dir(reply);
            });
            break;
        case 'sendone':
            mailsender.Send(urlRequest.query.message);
            break;
    }
}).listen(3000, function(){console.log("Server started on 3000 port")});