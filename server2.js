const express = require('express');
const path = require('path')
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
}]


// html 렌더링 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

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


app.get('/login_form', (req, res) => {
    res.render('login_form.html');
})

app.get('/login', (req, res) => {
    //추후 자세히 추가
    res.render('index.html');
})
////////////////////////////////////////////

app.get('/api/carlist', (req, res) => {
    res.json(sampleCarList);
})
app.get('/carlist2', (req, res) => {
    //테스트용
    console.log('test');
    res.render('carlist2.html', {obj: sampleCarList});
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
    res.render('ejs.html', {userid: 'aaaa', name:'홍길동', loop:5});
})
app.get('/ejs2', (req,res)=>{
    
    console.log('0번 구역');
    res.render('ejs.html', {userid:'aaaa', name:'황상욱',loop:5, title:'EJS'})
    console.log('0번 구역');
})


app.get('/main', (req, res) => {
    res.render('main.html');
})

app.listen(port, () => {
    console.log('Server listening ...' + port);
})