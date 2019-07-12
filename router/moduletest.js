let express = require('express');
let multer = require('multer');

console.log('라우터 시작');
let router = express.Router();
// let upload = multer({
//     dest: 'uploads/'
// });

let storage = multer.diskStorage({
    // 서버에 저장할 폴더
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // 서버에 저장할 파일명
    filename: function (req, file, cb) {
        file.uploadfilename = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
        cb(null, new Date().valueOf() + '_' + file.originalname);
    }
});

let upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 3*1024*1024
    }
});


router.get('/router', function (req, res) {
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

router.get('/setlocals', (req, res) => {
    res.locals.test2 = 'test2';
    res.render('test/locals.html', { test1: 'test1' });
})

router.get('/fileupload_form', (req, res) => {
    res.render('test/fileupload_form.html');
})
router.post('/fileupload', upload.single('avatar'), (req, res) => {
    console.log(req.file);
    res.redirect('/fileupload_form');
})

router.get('/fileupload_multi_form', (req, res) =>{
    res.render('test/multifile_upload.html');
})
//fileupload_multi
router.post('/fileupload_multi', upload.array('photos', 3), (req, res) => {
    console.log(req.files);
    res.redirect('/');
})


module.exports = router;


