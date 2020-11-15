const Db = require('./DB');
const db = new Db();

let config = {
        faculties: "FACULTY",
        pulpits: "PULPIT",
        subjects: "SUBJECT",
        auditorium_types: "AUDITORIUM_TYPE",
        auditoriums: "AUDITORIUM"
      };

module.exports = {

    selectHandler(request, response, objects) {
        const object = config[objects];
        if (!object) {
            response.statusCode = 404;
            response.end();
            return;
        }
        db.getAll(object).then(records => {            
            response.writeHead(200,{'Content-Type': 'application/json'});
            response.end(JSON.stringify(records.recordset));
        })
        .catch(error => {
            response.statusCode = 400;
            response.end(JSON.stringify({error: String(error)}));
        });
    },

    insertHandler(request, response, objects) {
        const object = config[objects];
        if (!object) {
            response.statusCode = 404;
            response.end();
            return;
        }
        let body = '';
        request.on('data', (chunk) => body += chunk.toString());
        request.on('end', () => {
            dataObject = JSON.parse(body);
            db.insertOne(object, dataObject)
                .then(() => db.getOne(object, dataObject))
                .then(record => {
                    response.writeHead(200,{'Content-Type': 'application/json'});
                    response.end(JSON.stringify(record.recordset[0]));
                })
                .catch(error => {
                    response.statusCode = 400;
                    response.end(JSON.stringify({error: String(error)}));
                });
        });
    },

    updateHandler(request, response, objects) {
        const object = config[objects];
        if (!object) {
            response.statusCode = 404;
            response.end();
            return;
        }
        let body = '';
        request.on('data', (chunk) => body += chunk.toString());
        request.on('end', () => {
            dataObject = JSON.parse(body);
            db.updateOne(object, dataObject)
                .then(() => db.getOne(object, dataObject))
                .then(record => {
                    response.writeHead(200,{'Content-Type': 'application/json'});
                    response.end(JSON.stringify(record.recordset[0]));
                })
                .catch(error => {
                    response.statusCode = 400;
                    response.end(JSON.stringify({error: String(error)}));
                });
        });
    },

    deleteHandler(request, response, objects, id) {
        const object = config[objects];
        if (!object) {
            response.statusCode = 404;
            response.end();
            return;
        }
        db.deleteOne(object, id)
        .then(() => {
            response.end('Success!');
        })
        .catch(error => {
            response.statusCode = 400;
            response.end(JSON.stringify({error: String(error)}));
        });
    }
};