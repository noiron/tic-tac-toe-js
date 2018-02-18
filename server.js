const path = require('path')
const express = require('express')
const app = express()

app.use('/', express.static(path.join(__dirname + '/build')));

const port = 3000;

app.listen(Number(process.env.PORT || port), function() {
    console.log('App is running at localhost:' + port + ' now.');
})