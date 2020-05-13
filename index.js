const path = require('path');
const express = require('express');
const indexRouter = require('./routes/index.router');
const appConfig = require('./config/app.config');
const port = appConfig.port

var app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', indexRouter);

app.listen(port, function() {
    console.log(`App is listening on ${port}`);
});