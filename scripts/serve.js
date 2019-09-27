var express = require('express');
var path = require('path');
var app = express();
var port = process.argv[3] || 3000;
app.get('/', function(req, res) {
    return res.sendFile(path.resolve(process.cwd(), './test.html'));
});
app.use('/~/', express.static('./.cache/dist'));
app.use(express.static('.'));
app.listen(port);
console.log('serving on port', port);