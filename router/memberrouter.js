let express = require('express');
let router = express.Router();

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
    res.render('/memeber/signin_form.html');
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
        let user = {
            userid: userid,
            password: hash,
            salt: salt,
            name: name,
            email: email
        }
        sampleUserList[userid] = user;
        fs.writeFileSync('../data/userlist.json', JSON.stringify(sampleUserList, null, 4));

        console.log('user added : ', user);
        res.redirect('/member/login_form');
    });
});


router.get('/login_form', (req, res) => {
    res.render('/member/login_form.html');
})

router.post('/login', (req, res) => {
    console.log(req.body);
    let userid = req.body.userid;
    let password = req.body.password;
    console.log('userid = ', userid);
    console.log('password = ', password);
    console.log('userlist = ', sampleUserList);
    let user = sampleUserList[userid];

    if (user) {
        hasher({
            password: password,
            salt: user.salt
        }, function (err, pass, salt, hash) {
            if (err) {
                console.log('ERR : ', err);
                //req.flash('fmsg', '오류가 발생했습니다.');
                res.redirect('/member/login_form');
            }
            if (hash === user.password) {
                console.log('INFO : ', userid, ' 로그인 성공')

                req.session.user = sampleUserList[userid];
                req.session.save(function () {
                    res.redirect('/member/login_success');
                })
                return;
            } else {
                // req.flash('fmsg', '패스워드가 맞지 않습니다.');
                res.redirect('/member/login_form');
                return;
            }
        });
    } else {
        console.log('아이디 없음');
        res.redirect('/member/login_form');
        return;
    }
    console.log("뒤에까지 가나요?")
});

router.get('/login_success', (req, res) => {
    console.log(req.session.user);
    res.render('index.html', {
        user: req.session.user,
    })

})

module.exports = router;