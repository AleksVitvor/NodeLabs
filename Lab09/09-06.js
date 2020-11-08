const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

let service = axios.create({
    baseURL: 'http://localhost:5000',
    responseType: "application/json"
});

const formData = new FormData();
formData.append(
    'textFile',
    fs.createReadStream(__dirname + '/MyFile.txt'),
    {knownLength: fs.statSync(__dirname + '/MyFile.txt').size}
);

service.post('/sixth_seventh', formData,{
    headers: {
        ...formData.getHeaders(),
        "Content-Length": formData.getLengthSync()
    }
})
.then(res=>{
    console.log('response: ', res.status);
    console.log('statusMessage: ', res.statusText);
    console.log('data: ' + JSON.stringify(res.data));
});