var path = require('path')
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './../views/index.html'))
})

router.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname, './../views/test.html'))
})

module.exports = router