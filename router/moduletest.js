let express = require('express');
let router = express.Router();

router.get('/router', function(req, res){
    console.log('라우터 테스트')
    res.send('test')
})
router.get('/setCookie', (req, res) => {
    console.log('/test/setCookie');
    res.cookie('user', { 'name': '안동원', "id": "user01" }, {
        maxAge: 5000,
        httpOnly: true
    });


    res.redirect('/test/getCookie');
});

router.get('/getCookie', (req, res) => {
    console.log('/test/getCookie');

    res.render('./test/getcookie.html', { cookie: req.cookies });

});


router.get('/setsession', (req, res) => {
    console.log('/test/setsession');

    req.session.myname = '홍길동';
    req.session.myid = 'hong'
    req.session.save(function () {
        res.redirect('/test/getsession');
    })
})

router.get('/getsession', (req, res) => {
    console.log('/test/getsession');
    console.log('session.myname = ', req.session.myname);

    res.render('/getsession.html', {
        myname: req.session.myname,
        myid: req.session.myid
    });
})

router.get('/setlocals', (req,res) => {
    res.locals.test2 = 'test2';
    res.render('test/locals.html', {test1: 'test1'});
})



module.exports = router;