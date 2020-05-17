var path = require('path')
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './../views/index.html'))
})

router.get('/v2', function(req, res) {
    res.sendFile(path.join(__dirname, './../views/v2.html'))
})

module.exports = router