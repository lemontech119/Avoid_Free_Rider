let express = require('express');
let router = express.Router();
const hasher = require('pbkdf2-password')();
const mysql = require('mysql');

let pool = mysql.createConnection({
    host: '70.12.50.164',
    user: 'root',
    password: '1234',
    port: 3306,
    database: 'moim_db',
    insecureAuth : true
});
let db_conn = true;

router.get('/logout', (req, res) => {
    console.log('로그아웃시도1');
    console.log(req.session.user);
    req.session.destroy(function () {
        req.session;
    });
    console.log('로그아웃시도2');
    res.redirect('/');
})

router.get('/signin_form', (req, res) => {
    res.render('signin_form.html');
})

router.get('/signin', (req, res) => {
    //추후 자세히 추가
    res.render('index.html');
})

router.post('/signup', (req, res) => {
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
            res.redirect('/member/signup_form');
        }
        //db 연결 시도 필요
        if(db_conn){
            pool.connect();
            db_conn = false;
        }
        let sql= `insert into Moim_member (id, psw, salt, name, email) values(?, ?, ?, ?, ?)`;

        console.log('회원 추가 시도', sql);

        
        pool.query(sql, [userid, hash, salt, name, email], function(err, rows){
            if(!err){
                console.log("The solution is", rows);
                res.redirect('/member/login_form');
            }else{
                res.redirect('/error');
            }
        })
        
    });
});


router.get('/login_form', (req, res) => {
    res.render('login_form.html');
})

router.post('/login', (req, res) => {
    console.log(req.body);
    let userid = req.body.userid;
    let password = req.body.password;
    console.log('userid = ', userid);
    console.log('password = ', password);

    //db 연결 시도 필요
    if(db_conn){
        pool.connect();
        db_conn = false;
    }
    let sql = 'Select * from Moim_member where id =\"' + userid+'\"';
    console.log('94번 줄' + sql);
    pool.query(sql, function(err, rows){
        console.log(rows);
        if (!err){
            hasher({
                password: password,
                salt: rows[0].salt
            }, function (err, pass, salt, hash) {
                if (err) {
                    console.log('ERR : ', err);
                    //req.flash('fmsg', '오류가 발생했습니다.');
                    res.redirect('/member/login_form');
                }
                if (hash === rows[0].psw) {
                    console.log('INFO : ', userid, ' 로그인 성공')
    
                    req.session.user = userid;
                    req.session.save(function () {
                        res.redirect('/member/login_success');
                    })
                    return;
                } else {
                    console.log('db에 있는 password' + rows[0].psw);
                    // req.flash('fmsg', '패스워드가 맞지 않습니다.');
                    console.log('비밀번호 에러');
                    res.redirect('/member/login_form');
                    return;
                }
            });
        }else{
            console.log('아이디 없음', err);
            res.redirect('/member/login_form');
        }
    })
   
    console.log("뒤에까지 가나요?")
});

router.get('/login_success', (req, res) => {
    console.log(req.session.user);
    res.render('index.html', {
        user: req.session.user,
    })

})

module.exports = router;