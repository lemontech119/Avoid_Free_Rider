let express = require('express');
let mysql = require('mysql');
const dbconfig = require('./dbconfig');

let connection = mysql.createConnection(dbconfig);



module.exports = function () {
    let router = express.Router();

    router.get('/test', function (req, res) {
        connection.connect();

        connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results[0].solution);
            res.json(results);

            connection.end();

        });

    });

    router.get('/getuser', function (req, res) {
        connection.connect();

        connection.query('SELECT * FROM user', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results[0].solution);
            res.json(results);

            connection.end();

        });

    });

    router.get('/adduser', function (req, res) {
        connection.connect();

        const query = 'insert into user Values("ccc", "ccc", "ccc", "ccc", "ccc@ccc")'; 

        connection.query(query, function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', query);
            res.send("test");

            connection.end();

        });

    });

    router.get('/adduser', function (req, res) {
        connection.connect();

        const query = 'insert into user Values("ccc", "ccc", "ccc", "ccc", "ccc@ccc")'; 

        connection.query(query, function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', query);
            res.send("test");

            connection.end();

        });

    });

    router.get('/adduser_form', (req, res) =>{
        res.render();
    })

    return router;
}