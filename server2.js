const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const hasher = require('pbkdf2-password')();
const morgan = require('morgan');
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
    img: 'image/brown.jpg',
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

const sampleUserList = [{
    userid : "test",
    password: 1234,
    name : "Ryan",
    email : "test@naver.com"

},
{
    userid : "aaa",
    password: "aaa",
    name : "aaa",
    email : "aaa@naver.com"

}]


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
app.get('/', (req, res) => {
    res.render('index.html');
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
        sampleUserList.push(user);
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
    let bFound = false;
 
    for (let i = 0; i < sampleUserList.length; i++) {
       
        let user = sampleUserList[i];
        console.log(sampleUserList[i]);
        if (userid === user.userid) {
            console.log('[found] userid = ', userid);
            bFound = true;
 
            return hasher({
                password: password,
                salt: user.salt
            }, function (err, pass, salt, hash) {
                if (err) {
                    console.log('ERR : ', err);
                    //req.flash('fmsg', '오류가 발생했습니다.');
                   
                }
                if (hash === user.password) {
                    console.log('INFO : ', userid, ' 로그인 성공')
                   
                    req.session.user = sampleUserList[i];
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
        }
        console.log('비밀번호 에러 확인');
        if (bFound) break;
    }
 
    //req.flash.msg('')
    if(!bFound) {
        console.log('not found');
    }
 
    //req.flash('fmsg', '사용자가 없습니다.');
    res.redirect('/login_form');
   
   
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
    //테스트용
    console.log('test2');
    res.render('kakaolist.html');
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


app.get('/test/setCookie', (req, res) => {
    console.log('/test/setCookie');
    res.cookie('user', { 'name': '안동원', "id": "user01" }, {
        maxAge: 5000,
        httpOnly: true
    });


    res.redirect('/test/getCookie');
});

app.get('/test/getCookie', (req, res) => {
    console.log('/test/getCookie');

    res.render('./test/getcookie.html', { cookie: req.cookies });

});


app.get('/test/setsession', (req, res) => {
    console.log('/test/setsession');

    req.session.myname = '홍길동';
    req.session.myid = 'hong'
    req.session.save(function () {
        res.redirect('/test/getsession');
    })
})

app.get('/test/getsession', (req, res) => {
    console.log('/test/getsession');
    console.log('session.myname = ', req.session.myname);

    res.render('test/getsession.html', {
        myname: req.session.myname,
        myid: req.session.myid
    });
})


app.listen(port, () => {
    console.log('Server listening ...' + port);
})