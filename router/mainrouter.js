let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {

    res.render('index.html');
})
router.get('/study_list', (req, res) => {
    res.render('study_list.html');
})

router.get('/project_list', (req, res) => {
    res.render('project_list.html');
})

router.get('/contest_list', (req, res) => {
    res.render('contest_list.html');
})


module.exports = router;