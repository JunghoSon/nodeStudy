var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    console.log('첫번째 미들웨어에서 요청을 처리함.');

    var paramId = req.body.uid || req.query.uid;
    var paramPassword = req.body.upw || req.query.upw;

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h1>Express서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.end();
});

app.use('/', function(req, res, next){
    console.log('두번째 미들웨어에서 요청을 처리함.');

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.end('<h1>Express 서버에서' + req.user + '가 응답한 결과입니다.</h1>');
});

app.listen(app.get('port'), function(){
    console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});