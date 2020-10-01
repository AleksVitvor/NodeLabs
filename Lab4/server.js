var http = require('http');
var url=require('url');
var fs=require('fs');
var data=require('./04-02');
const { time } = require('console');
const { setInterval } = require('timers');

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
db.on('COMMIT', ()=>
{
    db.commit();
});


var timer;
var timer1;
var timer2;
var flag=false;

var requestsCounter=0;
var commitsCounter=0;
var startTime;

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', ()=>
{
    let chunk=null;
    while((chunk=process.stdin.read())!=null)
    {
        if(chunk.split(' ')[0]=='sd' || chunk.trim()=='sd')
        {
            if(chunk.split(' ')[1]==undefined)
            {
                clearTimeout(timer);
            }
            else
            {
                timer=setTimeout((p1)=>
                {
                    process.exit();
                }, (parseInt(chunk.split(' ')[1]))*1000);
            }    
        } 
        if(chunk.split(' ')[0]=='sc' || chunk.trim()=='sc')
        {
            if(chunk.split(' ')[1]==undefined)
            {
                clearInterval(timer1);
            }
            else
            {
                timer1=setInterval((p1)=>
                {
                    db.emit('COMMIT');
                    if(flag)
                    {
                        commitsCounter++;
                    }
                }, (parseInt(chunk.split(' ')[1]))*1000);
            }    
        }
        if(chunk.split(' ')[0]=='ss' || chunk.trim()=='ss')
        {
            if(chunk.split(' ')[1]==undefined && flag)
            {
                //flag=false;
                //let endTime=Date.now();
                //db.saveStat({startTime, endTime, requestsCounter, commitsCounter});
                //commitsCounter=0;
                //requestsCounter=0;
                //console.log('statistic saved');
                timer2.unref();
            }
            else
            {
                commitsCounter=0;
                requestsCounter=0;
                startTime=new Date().toLocaleTimeString();
                flag=true;
                timer2=setTimeout((p1)=>
                {
                    flag=false;
                    let endTime=new Date().toLocaleTimeString();
                    db.saveStat({startTime, endTime, requestsCounter, commitsCounter});
                    commitsCounter=0;
                    requestsCounter=0;
                    console.log('statistic saved');
                }, (parseInt(chunk.split(' ')[1]))*1000);
            }
        }
    }
});

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
        case 'api/db':
            requestsCounter++;
            db.emit(request.method, request, response);
            break;
        case 'api/ss':
            response.end(JSON.stringify(db.loadLastStat()));
            break;
    }
}).listen(3000, function(){console.log("Server started on 3000 port")});