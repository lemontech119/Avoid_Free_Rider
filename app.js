const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const hasher = require('pbkdf2-password')();
const morgan = require('morgan');
const fs = require('fs');
const flash = require("connect-flash");
const app = express();
const port = 5050;
const mysql = require('mysql');

const kakao = [{
    img: 'image/ryan.jpg',
    name: '라이언',
    intro: '갈기가 없는 것이 콤플렉스인 수사자'
},
{
    img: 'image/muji.png',
    name: '무지와 콘',
    intro: '토끼 옷을 입은 단무지인 무지와 정체불명 콘'
},
{
    img: 'image/tube.png',
    name: '튜브',
    intro: '겁 많고 마음 약한 오리 튜브'
}];


let sampleUserList = {};
if (fs.existsSync('data/userlist.json')) {
    let rawdata = fs.readFileSync('data/userlist.json');
    sampleUserList = JSON.parse(rawdata);
    console.log('userlist 있긴함');
    //console.log(sampleUserList);
}


// html 렌더링 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(morgan('dev'));


app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use('/files', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({
    extended: false
}));



app.use(cookieparser());
app.use(session({
    secret: '1A@W#E$E',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));


app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
})

app.use('/files', express.static(path.join(__dirname, 'uploads')));


//require('./part.js');
//console.log(part.a)

//라우터
let test_router = require('./router/moduletest');
let main_router = require('./router/mainrouter');
let member_router = require('./router/memberrouter');
app.use('/test', test_router);
app.use(main_router);
app.use('/member',member_router);

app.use(function(req, res, next){
    res.status(404).render('error404.html');
});

////////////////////////////////////////////

app.get('/api/kakaolist', (req, res) => {
    res.json(kakao);
})
app.get('/kakaolist', (req, res) => {
    if (req.session.user) {
        console.log('로그인된 사용자');
        res.render('kakaolist.html');
    } else {
        console.log('로그인 안됨. 로그인 페이지 이동');
        res.redirect('/login_form');
    }

})



app.post('/api/filter', (req, res) => {
    console.log(req.body);
    console.log(req.body.searchText);

    let kakao_name = req.body.searchText;
    //let carNum = '22주2222';
    let found = kakao.filter(function (element) {
        console.log('element = ', element);
        if (element.name === kakao_name) {
            console.log('found');
            return element;
        }
    });

    console.log('found = ', found);
    res.json(found);

});

app.get('/member_test', (req, res) => {
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        port: 3306,
        database: 'moim_db',
        insecureAuth : true
    });
    connection.connect();

    connection.query('SELECT * from member', function (err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.send(rows);
        }else{
            console.log('Error while performing Query.', err);
        }
    });

    connection.end();

})



app.listen(port, () => {
    console.log('Server listening ...' + port);
})