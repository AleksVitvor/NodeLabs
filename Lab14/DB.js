const sql = require('mssql/msnodesqlv8');

let config = {driver: "msnodesqlv8", connectionString: "Driver={SQL Server Native Client 11.0};Server={DESKTOP-1JIVBFF\\SQLEXPRESS};Database={MDA};Trusted_Connection={yes};"};
let pool;

class Db {
    constructor() { pool = new sql.ConnectionPool(config).connect();}

    getAll(tbName) { return pool.then(p => p.query(`SELECT * FROM ${tbName}`));}

    getOne(tbName, fields) {
        return pool.then(p => {
            const request = p.request();
            if(tbName == 'FACULTY'){
                let command = `SELECT TOP(1) * FROM FACULTY WHERE FACULTY = '${fields.FACULTY}' AND FACULTY_NAME = '${fields.FACULTY_NAME}';`;
                return request.query(command);
            }
            else if(tbName == 'PULPIT'){
                let command = `SELECT TOP(1) * FROM PULPIT WHERE PULPIT = '${fields.PULPIT}' AND PULPIT_NAME = '${fields.PULPIT_NAME}' AND FACULTY = '${fields.FACULTY}';`;
                return request.query(command);
            }
            else if(tbName == 'SUBJECT'){
                let command = `SELECT TOP(1) * FROM SUBJECT WHERE SUBJECT = '${fields.SUBJECT}' AND SUBJECT_NAME = '${fields.SUBJECT_NAME}' AND PULPIT = '${fields.PULPIT}';`;
                return request.query(command);
            }
            else if(tbName == 'AUDITORIUM_TYPE'){
                let command = `SELECT TOP(1) * FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = '${fields.AUDITORIUM_TYPE}' AND AUDITORIUM_TYPENAME = '${fields.AUDITORIUM_TYPENAME}';`;
                return request.query(command);
            }
            else if(tbName == 'AUDITORIUM'){
                let command = `SELECT TOP(1) * FROM AUDITORIUM WHERE AUDITORIUM = '${fields.AUDITORIUM}' AND AUDITORIUM_NAME = '${fields.AUDITORIUM_NAME}' AND AUDITORIUM_TYPE = '${fields.AUDITORIUM_TYPE}' AND AUDITORIUM_CAPACITY = '${fields.AUDITORIUM_CAPACITY}';`;
                return request.query(command);
            }
        }).then(results => {
            if (results.recordset.length === 0) {
                throw 'There are no such records';
            }
            return results;
        });
    }
    insertOne(tbName, fields) {
        return pool.then(p => {
            const request = p.request();
            if(tbName == 'FACULTY'){
                let command = `INSERT INTO FACULTY(FACULTY, FACULTY_NAME) values ('${fields.FACULTY}', '${fields.FACULTY_NAME}');`;
                return request.query(command);
            }
            else if(tbName == 'PULPIT'){
                let command = `INSERT INTO PULPIT(PULPIT,PULPIT_NAME,FACULTY) values('${fields.PULPIT}','${fields.PULPIT_NAME}','${fields.FACULTY}');`;
                return request.query(command);
            }
            else if(tbName == 'SUBJECT'){
                let command = `INSERT INTO SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) values('${fields.SUBJECT}', '${fields.SUBJECT_NAME}', '${fields.PULPIT}');`;
                return request.query(command);
            }
            else if(tbName == 'AUDITORIUM_TYPE'){
                let command = `INSERT INTO AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) values('${fields.AUDITORIUM_TYPE}', '${fields.AUDITORIUM_TYPENAME}');`;
                return request.query(command);
            }
            else if(tbName == 'AUDITORIUM'){
                let command = `INSERT INTO AUDITORIUM(AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY) values('${fields.AUDITORIUM}', '${fields.AUDITORIUM_NAME}', '${fields.AUDITORIUM_TYPE}', '${fields.AUDITORIUM_CAPACITY}');`;
                return request.query(command);
            }
        });
    }

    updateOne(tbName, fields) {
        return pool.then(p => {
            const request = p.request();
            if(tbName == 'FACULTY'){
                let command = `UPDATE FACULTY SET FACULTY_NAME='${fields.FACULTY_NAME}' WHERE FACULTY='${fields.FACULTY}';`;
                return request.query(command);
            }            
            else if(tbName == 'PULPIT'){
                let command = `UPDATE PULPIT SET PULPIT_NAME = '${fields.PULPIT_NAME}', FACULTY = '${fields.FACULTY}' WHERE PULPIT = '${fields.PULPIT}';`;
                return request.query(command);
            }
            else if(tbName == 'SUBJECT'){
                let command = `UPDATE SUBJECT SET SUBJECT_NAME = '${fields.SUBJECT_NAME}', PULPIT = '${fields.PULPIT}' WHERE SUBJECT = '${fields.SUBJECT}';`;
                return request.query(command);
            }
            else if(tbName == 'AUDITORIUM_TYPE'){
                let command = `UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME = '${fields.AUDITORIUM_TYPENAME}' WHERE AUDITORIUM_TYPE = '${fields.AUDITORIUM_TYPE}';`;
                return request.query(command);
            }
            else if(tbName == 'AUDITORIUM'){
                let command = `UPDATE AUDITORIUM SET AUDITORIUM_NAME = '${fields.AUDITORIUM_NAME}', AUDITORIUM_TYPE = '${fields.AUDITORIUM_TYPE}', AUDITORIUM_CAPACITY = '${fields.AUDITORIUM_CAPACITY}' WHERE AUDITORIUM = '${fields.AUDITORIUM}';`;
                return request.query(command);
            }
        });
    }

    deleteOne(tbName, id) {
        return pool.then(p => {
            if (!id) {
                throw 'There are no Id value has been provided. Example: /api/instances/:id';
            }
            return p.query(`DELETE FROM ${tbName} WHERE ${tbName} = '${id}';`);
        });
    }
}

module.exports = Db;