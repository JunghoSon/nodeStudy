var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
    console.log('첫번째 미들웨어에서 요청을 처리함.');

    //res.status(403).send('Forbidden');
    //res.sendStatus(403);
    res.redirect('http://www.google.co.kr');
});

app.use('/', function(req, res, next){
    console.log('두번째 미들웨어에서 요청을 처리함.');

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.end('<h1>Express 서버에서' + req.user + '가 응답한 결과입니다.</h1>');
});

app.listen(app.get('port'), function(){
    console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});