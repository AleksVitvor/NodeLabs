const http = require('http');
const url = require('url');
const rpcWSS = require('rpc-websockets').Server;
const fs = require('fs');


const FILE_PATH = './StudentList.json';
const BACKUP_DIR_PATH = './backup/';

const server = new rpcWSS({port:4000, host:'localhost'});
server.event('Changed!');

function sendResponse(res, status, contentType, data) {
    res.writeHead(status, { 'Content-type': contentType });
    res.end(data);
}

let isStudentList = (fn)=>{ 
    let reg = new RegExp("[0-9]+_StudentList.json"); 
    return reg.test(fn);
}

http.createServer((req, res) => {

    let pathName = url.parse(req.url).pathname;    
    let splittedPath = pathName.split('/');

    if(req.method == 'GET'){        
        if (pathName == '/') {
            fs.readFile(FILE_PATH, (err, data) => {
                if (err) {
                    sendResponse(res, 400, 'text/plain', err.message);
                } else {
                    sendResponse(res, 200, 'application/json', data);
                }
            });
        } 
        else if (pathName == '/backup') {
            fs.readdir(BACKUP_DIR_PATH, ((err, files) => {
                sendResponse(res, 200, 'application/json', JSON.stringify(files));
            }));
        }   
        else if (splittedPath.length > 1 && splittedPath[0] == '') {
            let id = Number(splittedPath[1]);
            if(!Number.isInteger(id)){
                sendResponse(res, 400, 'text/plain', 'Arguments error');
                return;
            }
            fs.readFile(FILE_PATH, (err, data) => {
                if (err) {
                    sendResponse(res, 400, 'text/plain', err.message);
                } else {
                    let dataObject = JSON.parse(data);
                    for (const element in dataObject) {
                        if (dataObject[element].id == id) {
                            sendResponse(res, 200, 'application/json', JSON.stringify(dataObject[element]));
                            return;
                        }
                    }
                    sendResponse(res, 400, 'text/plain', `No user with id ${id}`);
                }
            });
        }
    }

    if(req.method == 'POST'){
        if (pathName == '/') {
            let body = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', () => {
                let dataObject = JSON.parse(body);
                fs.readFile(FILE_PATH, (err, data) => {
                    if (err) {
                        sendResponse(res, 400, 'text/plain', err.message);
                    } else {
                        let fileObject = JSON.parse(data);
                        let found = false;
                        fileObject.forEach(element => {
                            if (element.id == dataObject.id) {
                                found = true;
                                return;
                            }
                        });
                        if (found) {
                            sendResponse(res, 400, 'text/plain', 'Student already exists');
                        } else {
                            fileObject.push(dataObject);
                            fs.writeFile(FILE_PATH, JSON.stringify(fileObject), (err) => {
                                if (err) {
                                    sendResponse(res, 400, 'text/plain', err.message);
                                } else {
                                    sendResponse(res, 200, 'application/json', JSON.stringify(dataObject));
                                }
                                server.emit('Changed!', __dirname, 'Add data');
                            });
                        }
                    }
                });
            });
        }
        else if (pathName == '/backup') {
            let currentDate = new Date();
            let fname = '';
            fname+=currentDate.getFullYear();
            fname+= '0'+(currentDate.getMonth() + 1);
            fname+=currentDate.getDate();
            fname+=currentDate.getHours();
            fname+=currentDate.getMinutes();
            fname+='_StudentList.json';
            setTimeout(() => {
                fs.copyFile(FILE_PATH, BACKUP_DIR_PATH + fname, (err) => {
                    if (err) {
                        sendResponse(res, 500, 'text/plain', err.message);
                    } else {
                        sendResponse(res, 200, 'text/plain', `Created: ${fname}`);
                    }
                });
            }, 2000);
        }
    }

    if(req.method == 'PUT'){
        if (pathName == '/') {
            let body = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', () => {
                let dataObject = JSON.parse(body);
                fs.readFile(FILE_PATH, (err, data) => {
                    if (err) {
                        sendResponse(res, 400, 'text/plain', err.message);
                    } else {
                        let fileObject = JSON.parse(data);
                        let found = false;
                        for (i in fileObject) {
                            if (fileObject[i].id == dataObject.id) {
                                found = true;
                                fileObject[i].id = dataObject.id;
                                fileObject[i].name = dataObject.name;
                                fileObject[i].bday = dataObject.bday;
                                fileObject[i].speciality = dataObject.speciality;
                                fs.writeFile(FILE_PATH, JSON.stringify(fileObject), (err) => {
                                    if (err) {
                                        sendResponse(res, 400, 'text/plain', err.message);
                                    } else {
                                        sendResponse(res, 200, 'application/json', JSON.stringify(dataObject));
                                    }
                                    server.emit('Changed!', __dirname, 'Edit data');
                                });
                                break;
                            }
                        };
                        if (!found) {
                            sendResponse(res, 400, 'text/plain', 'Student not exists');
                        }
                    }
                });
            });
        }
    }

    if(req.method == 'DELETE'){
        if(url.parse(req.url).pathname.search('\/backup\/[1-9]+')!=(-1))
        {
            let p = url.parse(req.url,true);
            let r =decodeURI(p.pathname).split('/');
            let x=r[2];
            fs.readdirSync('./backup/').map(fileName => {
                if(isStudentList(fileName))
                {
                    let result=fileName.split('_')[0];
                    if(result>x)
                    {
                        fs.unlink("./backup/"+fileName,(e)=>
                        {
                            if(e) console.log("Ошибка: ",e);
                        })
                    }
                }
            });
            res.end("Удаление завершено");
        }
        else if (splittedPath.length > 1 && splittedPath[0] == '') {
            let pickedIdx = parseInt(splittedPath[1]);
            if (isNaN(pickedIdx)) {
                sendResponse(res, 400, 'text/plain', 'Wrong argument');
                return;
            }
            fs.readFile(FILE_PATH, (err, data) => {
                if (err) {
                    sendResponse(res, 500, 'text/plain', err.message);
                    return;
                }
                let fileObject = JSON.parse(data);
                for (i in fileObject) {
                    if (fileObject[i].id == pickedIdx) {
                        sendResponse(res, 200, 'application/json', JSON.stringify(fileObject[i]));
                        fileObject.splice(i, 1);
                        fs.writeFile(FILE_PATH, JSON.stringify(fileObject), (err) => {
                            server.emit('Changed!', __dirname, 'Delete data');
                            if (err)
                                console.log('write file error');
                        });
                        return;
                    }
                }
                sendResponse(res, 400, 'text/plain', 'Invalid id');
            });
        }
    }

}).listen(5000);
console.log('Server running at http://localhost:5000/');


try{
    fs.watch(BACKUP_DIR_PATH, (event, f)=>{
        if(f){
            server.emit('Changed!', f, event);
        }
    });
}
catch(e){
    console.log('catch e = ', e.code);
}


