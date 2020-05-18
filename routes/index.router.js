var path = require('path')
var express = require('express');
var router = express.Router();

router.get('/path-finding-visualizer', function(req, res) {
    res.sendFile(path.join(__dirname, './../views/index.html'))
})

router.get('/*', function(req, res) {
    res.redirect('/path-finding-visualizer')
})

module.exports = router