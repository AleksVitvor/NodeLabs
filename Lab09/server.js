var http = require('http');
let url = require('url');
let fs = require('fs');
let parseString = require('xml2js').parseString;
let mp=require('multiparty');


let server = http.createServer((request, response)=>{
    let parsedUrl = url.parse(request.url, true);

    if (parsedUrl.pathname === '/') {
        response.statusCode = '201';
        response.end("first task of lab09");
    } 
    else if (parsedUrl.pathname === '/second') {
        response.end("Second task of lab09. Params: "+parsedUrl.query.x+", "+parsedUrl.query.y);
    } 
    else if (parsedUrl.pathname === '/third') {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            data = JSON.parse(data);
            response.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
            response.end("Third task of lab09. Params: "+data.x+", "+data.y+", "+data.s);
        });
    } 
    else if (parsedUrl.pathname === '/fourth') {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            data = JSON.parse(data);
            response.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
            let comment = 'Ответ.' + data.__comment;
            let resp = {};
            resp.__comment = comment;
            resp.x_plus_y = data.x + data.y;
            resp.Concatenation_s_o = data.s + ': '+data.o.surname + ', ' + data.o.name;
            resp.Length_m = data.m.length;
            response.end(JSON.stringify(resp));
        });
    } 
    else if (parsedUrl.pathname === '/fifth') {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            parseString(data, function(err, result) {
                response.writeHead(200, {'Content-type': 'application/xml'});
                let id = result.request.$.id;
                let sum = 0;
                let concat = '';
                result.request.x.forEach((p) => {
                    sum += parseInt(p.$.value);
                });
                result.request.m.forEach((p) => {
                    concat += p.$.value;
                });

                let responseText = `<response id="33" request="${id}"><sum element="x" result="${sum}"/><concat element="m" result="${concat}"/></response>`;
                response.end(responseText);
            });
        });
    } 
    else if (parsedUrl.pathname === '/sixth_seventh') {
        let result='';
		let form =new mp.Form({uploadDir:'./'});
		form.on('field',(name,value)=>{
			console.log('------------field-------------');
			console.log(name,value);
			result+=`<br/>---${name}= ${value}`;
		});
		form.on('file', (name, file)=>{
			console.log('-----file ------------');
			console.log(name,file);
			result+=`<br/>---${name}= ${file.originalFilename}: ${file.path}`;
		});
		form.on('error',(err)=> {
			console.log('------err--------------');
			console.log('err =',err);
			response.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
			response.write('<h1>Form/error</h1>');
			response.end()
		});
		form.on('close',()=>{
			console.log('-----------close----------');
			response.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
			response.write('<h1>Form</h1>');
			response.end(result);
		})
        form.parse(request);
    } 
    else if (parsedUrl.pathname === '/eighth') {
        let path = __dirname+'/MyFile.txt';
        fs.access(path, fs.constants.R_OK, err=>{
            if(err){
                response.statusCode=404;
                response.end('Resourse not found!');
            }else{
                fs.createReadStream(path).pipe(response);
            }
        })
    }

}).listen(5000);

console.log('Server running at http://localhost:5000/');