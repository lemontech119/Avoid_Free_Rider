let express = require('express');
const hasher = require('pbkdf2-password')();
const User = require('../schemas/user');

module.exports = function () {
    let router = express.Router();

    router.get('/', function (req, res) {
        res.send("mongo connect");
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