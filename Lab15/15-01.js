const http = require("http");
const url = require('url');

const MongoClient = require('mongodb').MongoClient;

http.createServer(function (request, response) {
    if (request.method == 'GET') {
        if (url.parse(request.url).pathname === '/api/faculties') {
            MongoClient.connect("mongodb+srv://username:Q123456Q@bstu-3f9xb.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                var db = client.db('bstu');
                db.collection('faculty', function (err, collection) {
                    collection.find().toArray(function (err, items) {
                        if (err) {
                            console.log('Error geting item');
                            response.send('Error geting item');
                        }
                        console.log('Document Inserted Successfully');
                        console.log(items);
                        response.end(JSON.stringify(items));
                    });
                    
                });

            });
        }
        else if (url.parse(request.url).pathname === '/api/pulpits') {
            MongoClient.connect("mongodb+srv://username:Q123456Q@bstu-3f9xb.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                var db = client.db('bstu');
                db.collection('pulpit', function (err, collection) {
                    collection.find().toArray(function (err, items) {
                        if (err) {
                            console.log('Error geting item');
                            response.send('Error geting item');
                        }
                        console.log('Document Inserted Successfully');
                        console.log(items);
                        response.end(JSON.stringify(items));
                    });
                    
                });

            });
        }
    }
    else if (request.method == 'POST') {
        if (url.parse(request.url).pathname === '/api/faculties') {
            request.on('data', (data) => {
                MongoClient.connect("mongodb+srv://username:Q123456Q@bstu-3f9xb.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                    var db = client.db('bstu');
                    db.collection('faculty', function (err, collection) {
                        collection.insert({ faculty: JSON.parse(data.toString()).faculty, faculty_name: JSON.parse(data.toString()).faculty_name }, function (err, doc) {
                        });
                        if (err) {
                            console.log('Error inserting item');
                            response.send('Error inserting item');
                        }
                    });
                    console.log('Document Updated Successfully');
                    response.end(request.body);
                });
            })
        }
        else if (url.parse(request.url).pathname === '/api/pulpits') {
            request.on('data', (data) => {
                MongoClient.connect("mongodb+srv://username:Q123456Q@bstu-3f9xb.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                    var db = client.db('bstu');
                    db.collection('pulpit', function (err, collection) {
                        collection.insert({ pulpit: JSON.parse(data.toString()).pulpit, pulpit_name: JSON.parse(data.toString()).pulpit_name, faculty: JSON.parse(data.toString()).faculty }, function (err, doc) {
                        });
                        if (err) {
                            console.log('Error inserting item');
                            response.send('Error inserting item');
                        }
                    });
                    console.log('Document Updated Successfully');
                    response.end(request.body);
                });
            })
        }
    }
    else if (request.method == 'PUT') {
        if (url.parse(request.url).pathname === '/api/faculties') {
            request.on('data', (data) => {
                MongoClient.connect("mongodb+srv://username:Q123456Q@bstu-3f9xb.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                    var db = client.db('bstu');
                    db.collection('faculty', function (err, collection) {
                        collection.update({ faculty: JSON.parse(data.toString()).faculty }, { $set: { faculty_name: JSON.parse(data.toString()).faculty_name } },
                            function (err, result) {
                                if (err) {
                                    console.log('Error updating item');
                                    response.end('Error updating item');
                                }
                                console.log('Document Updated Successfully');

                            });
                        response.end(request.body);
                    });
                });
            });
        }
        else if (url.parse(request.url).pathname === '/api/pulpits') {
            request.on('data', (data) => {
                MongoClient.connect("mongodb+srv://username:Q123456Q@bstu-3f9xb.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                    var db = client.db('bstu');
                    db.collection('pulpit', function (err, collection) {
                        collection.update({ pulpit: JSON.parse(data.toString()).pulpit }, { $set: { pulpit_name: JSON.parse(data.toString()).pulpit_name, faculty: JSON.parse(data.toString()).faculty } },
                            function (err, result) {
                                if (err) {
                                    console.log('Error updating item');
                                    response.end('Error updating item');
                                }
                                console.log('Document Updated Successfully');

                            });
                        response.end(request.body);
                    });
                });
            });
        }
    }
    else if (request.method == 'DELETE') {
        if (url.parse(request.url).pathname.split('/').length === 4 && url.parse(request.url).pathname.split('/')[3]) {
            MongoClient.connect("mongodb+srv://username:Q123456Q@bstu-3f9xb.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                const xyz = url.parse(request.url).pathname.split('/')[3];
                var db = client.db('bstu');
                db.collection('faculty', function (err, collection) {
                    collection.findOneAndDelete({ faculty: xyz }, function (err, result) {
                        if (err || !result.value) {
                            console.log('Error deleting item');
                            response.end('Error deleting item');
                        }
                        console.log('Document Removed Successfully');
                        response.end(JSON.stringify(result.value));
                    });
                });
            });
        }
        else if (url.parse(request.url).pathname.split('/').length === 4 && url.parse(request.url).pathname.split('/')[3]) {
            MongoClient.connect("mongodb+srv://username:Q123456Q@bstu-3f9xb.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                const xyz = url.parse(request.url).pathname.split('/')[3];
                var db = client.db('bstu');
                db.collection('pulpit', function (err, collection) {
                    collection.findOneAndDelete({ pulpit: xyz }, function (err, result) {
                        if (err || !result.value) {
                            console.log('Error deleting item');
                            response.end('Error deleting item');
                        }
                        console.log('Document Removed Successfully');
                        response.end(JSON.stringify(result.value));
                    });
                });
            });
        }
    }
}).listen(3000);

console.log('Server running at http://localhost:3000/');