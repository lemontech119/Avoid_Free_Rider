const express = require('express');
const path = require('path');
// nodemailer 선언
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const app = express();
const port = 3000;

function randNum() {
    let ALPHA = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
                 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                 'w', 'x', 'y', 'z',
                 '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let rN = '';
    for (var i = 0; i < 8; i++) {
        var randTnum = Math.floor(Math.random() * ALPHA.length);
        rN += ALPHA[randTnum];
    }
    return rN;
}

app.get('/test', (req, res) => {
    // 발송 메일 설정입니다. 
    let transporter = nodemailer.createTransport(smtpTransport({
        service:'naver',
        auth: {
            user: 'ado119@naver.com',
            pass: 'k124578'
        }
    }));

    let new_password = randNum();

    // 이메일 기본 설정입니다.
    let mailOptions = {
        from: 'ado119@naver.com',
        to: 'lemontech119@gmail.com',
        subject: 'new_password',
        text: '당신의 새 비밀번호는 ' + new_password + '입니다.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log('에러발생 ㅠㅠ' + error)
        }else {
            console.log('이메일 발송 성공 우훗! : ' + info.response);
            res.send(new_password);
        }

        transporter.close();
    })
    

});

app.listen(port, () => {
    console.log('Server listening ...' + port);
})