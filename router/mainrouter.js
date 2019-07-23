let express = require('express');
let router = express.Router();
const mysql = require('mysql');

let pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    port: 3306,
    database: 'moim_db',
    insecureAuth : true
});
let db_conn = true;



router.get('/', (req, res) => {

    res.render('index.html');
})

router.get('/error', (req, res) => {

    res.render('error.html');
})
router.get('/404_error_template', (req, res)=>{
    res.render('error404.html');
})

router.get('/study_list', (req, res) => {
    if(db_conn){
        pool.connect();
        db_conn = false;
    }
    

    pool.query('SELECT * from Moim where tableRole="study"', function (err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.render('study_list.ejs', {rows: rows});
        }else{
            console.log('Error while performing Query.', err);
            res.redirect('/error');
        }
    });

    
})

router.get('/project_list', (req, res) => {
    if(db_conn){
        pool.connect();
        db_conn = false;
    }
    pool.query('SELECT * from Moim where tableRole="project"', function (err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            
            res.render('project_list.ejs', {rows: rows});
        }else{
            console.log('Error while performing Query.', err);
            
            res.redirect('/error');
        }
    });

})

router.get('/contest_list', (req, res) => {
    if(db_conn){
        pool.connect();
        db_conn = false;
    }
    pool.query('SELECT * from Moim where tableRole="contest"', function (err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.render('contest_list.ejs', {rows: rows});
        }else{
            console.log('Error while performing Query.', err);
            res.redirect('/error');
        }
    });

})

router.get('/read', (req, res) => {
    if(db_conn){
        pool.connect();
        db_conn = false;   
    }
    let sql = 'Select * from Moim where tableIdx = ' + req.query.tableIdx;
    pool.query(sql, function(err, rows){
        if (!err){
            console.log('The solution is: ', rows);
            res.render('tableRead.ejs', {rows: rows});
        }else{
            console.log('Error while performing Query.', err);
            res.redirect('/error');
        }
    })
})

router.get('/write', (req, res, rows) => {
    let role = req.query.tableRole;
    console.log(role);
    console.log("role");
    res.render('writeTable.ejs', {rows: role});
})

router.post('/write_table', (req, res) => {
    console.log(req.body);
    // 회원가입
    let id = req.body.id;
    let title = req.body.title;
    let tableRole = req.body.tableRole;
    let content = req.body.content;
    let sql= "insert into Moim (id, title, content, tableRole) values(\'" + 
    id + "\', \'" +  title + "\', \'" +  content + "\', \'" + tableRole + "\')";
    console.log(sql);
    pool.query(sql, function(err, rows){
        if(!err){
            console.log("The solution is", rows);
            res.redirect('/study_list');
        }else{
            res.redirect('/error');
        }
    })
});

router.get('/delete', (req, res) => {
    let tableIdx = req.query.tableIdx;
    let sql= "delete from Moim where tableIdx="+ tableIdx;
    console.log(sql);
    pool.query(sql, function(err, rows){
        if(!err){
            console.log('delete 성공인가?');
            res.redirect('/study_list');
        }else {
            console.log(err);
            res.redirect('/error');
        }
    })

})
module.exports = router;