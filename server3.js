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
const port = 3000;


const sampleCarList = [{
    carNumber: '11주1111',
    owner: '홍길동',
    model: 'SONATA',
    company: 'HYUNDAI',
    numOfAccident: 2,
    numOfOwnerChange: 1
},
{
    carNumber: '22주2222',
    owner: '손오공',
    model: 'MORNING',
    company: 'KIA',
    numOfAccident: 1,
    numOfOwnerChange: 3
}
];
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
if (fs.existsSync('data/userlist.json')){
    let rawdata = fs.readFileSync('data/userlist.json');
    sampleUserList = JSON.parse(rawdata);
    console.log(sampleUserList);    
}


// html 렌더링 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(morgan('dev'));


app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

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


app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
})

//require('./part.js');
//console.log(part.a)

let test_router = require('./router/moduletest');
let main_router = require('./router/mainrouter');
app.use('/test', test_router);
app.use(main_router);


app.get('/logout', (req, res)=>{
    console.log('로그아웃시도1');
    console.log(req.session.user);
    req.session.destroy(function () {
        req.session;
    });
    console.log('로그아웃시도2');
    res.redirect('/'); 
})

app.get('/signin_form', (req, res) => {
    res.render('signin_form.html');
})

app.get('/signin', (req, res) => {
    //추후 자세히 추가
    res.render('index.html');
})

app.post('/signup', (req, res) => {
    console.log(req.body);
    // 회원가입
    let userid = req.body.userid;
    let password = req.body.password;
    let name = req.body.name;
    let email = req.body.email;
    console.log('userid = ', userid);
    console.log('password = ', password);
    console.log('name = ', name);
    console.log('email = ', email);

    hasher({
        password: req.body.password
    }, (err, pass, salt, hash) => {
        if (err) {
            console.log('ERR: ', err);
            res.redirect('/signup_form');
        }
        let user = {
            userid: userid,
            password: hash,
            salt: salt,
            name: name,
            email: email
        }
        sampleUserList[userid] = user;
        fs.writeFileSync('data/userlist.json', JSON.stringify(sampleUserList, null, 4));

        console.log('user added : ', user);
        res.redirect('/login_form');
    });
});



app.get('/login_form', (req, res) => {
    res.render('login_form.html');
})

app.post('/login', (req, res) => {
    console.log(req.body);
    let userid = req.body.userid;
    let password = req.body.password;
    console.log('userid = ', userid);
    console.log('password = ', password);
    console.log('userlist = ', sampleUserList);
    let user = sampleUserList[userid];
    
    if(user){
        hasher({
            password: password,
            salt: user.salt
        }, function (err, pass, salt, hash) {
            if (err) {
                console.log('ERR : ', err);
                //req.flash('fmsg', '오류가 발생했습니다.');
                res.redirect('login_form');
            }
            if (hash === user.password) {
                console.log('INFO : ', userid, ' 로그인 성공')
               
                req.session.user = sampleUserList[userid];
                req.session.save(function () {
                    res.redirect('/login_success');
                })
                return;
            } else {
               // req.flash('fmsg', '패스워드가 맞지 않습니다.');
               res.redirect('/login_form');
               return;
            }
        });
    }else{
        console.log('아이디 없음');
        res.redirect('/login_form');
        return;
    }
    console.log("뒤에까지 가나요?")
 });
 
app.get('/login_success', (req, res) => {
    res.render('index.html', {
        user: req.session.user,
    })
    
})
////////////////////////////////////////////

app.get('/api/carlist', (req, res) => {
    res.json(sampleCarList);
})
app.get('/carlist2', (req, res) => {
    //테스트용
    console.log('test');
    res.render('carlist2.html', { obj: sampleCarList });
})
app.get('/api/kakaolist', (req, res) => {
    res.json(kakao);
})
app.get('/kakaolist', (req, res) => {
    if(req.session.user){
        console.log('로그인된 사용자');
        res.render('kakaolist.html');
    }else{
        console.log('로그인 안됨. 로그인 페이지 이동');
        res.redirect('/login_form');
    }

})

app.post('/api/regcar', (req, res) => {
    console.log('test중');
    console.log(req.body);
    sampleCarList.push(req.body);
    res.json(sampleCarList)
})
app.get('/ejs', (req, res) => {
    console.log('');
    res.render('ejs.html', { userid: 'aaaa', name: '홍길동', loop: 5 });
})
app.get('/ejs2', (req, res) => {

    console.log('0번 구역');
    res.render('ejs.html', { userid: 'aaaa', name: '황상욱', loop: 5, title: 'EJS' })
    console.log('0번 구역');
})


app.get('/main', (req, res) => {
    res.render('main.html');
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
 


app.listen(port, () => {
    console.log('Server listening ...' + port);
})