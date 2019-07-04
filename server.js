const express = require('express');
const path = require('path')
const app = express();
const port = 3000;

// html 렌더링 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded({
    extended: false 
}));

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) =>{
    res.render('index.html');
})

app.get('/signin_form', (req, res) => {
    res.render('signin_form.html');
})

app.get('/signin', (req, res) => {
    //추후 자세히 추가
    res.render('index.html');
})


app.get('/login_form', (req, res) =>{
    res.render('login_form.html');
})

app.get('/login', (req, res) =>{
    //추후 자세히 추가
    res.render('index.html');
})

app.listen(port, () => {
    console.log('Server listening ...' + port);
})