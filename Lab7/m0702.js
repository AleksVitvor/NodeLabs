var fs=require('fs');

module.exports.Find=(resoucePath, response)=>
{
    fs.access(resoucePath, err => {
        // если произошла ошибка - отправляем статусный код 404
        if(err){
            response.statusCode = 404;
            response.end("Resourse not found!");
        }
        else{
            fs.createReadStream(resoucePath).pipe(response);
        }
    });
}