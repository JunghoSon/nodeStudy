var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');

var app = express();
var router = express.Router();

app.set('port', process.env.PORT || 8083);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

router.post('/process/login/:name', function(req, res){
    console.log('/process/login 처리함.');

    var paramName = req.params.name;

    var paramId = req.body.uid || req.query.uid;
    var paramPassword = req.body.upw || req.query.upw;

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h1>Express서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param name : ' + paramName + '</p></div>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write('<a href="/login2.html">로그인 페이지로 돌아가기</a>');
    res.end();
});

router.get('/process/users/:id', function(req, res){
    var paramId = req.params.id;

    console.log('/process/users 와 토큰 %s를 사용해 처리함', paramId);

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h1>Express서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.end();
});

app.use('/', router);

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'  //상대경로로 지정해야 함
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


// app.use(function(req, res, next){
//     console.log('첫번째 미들웨어에서 요청을 처리함.');
//
//     var paramId = req.body.uid || req.query.uid;
//     var paramPassword = req.body.upw || req.query.upw;
//
//     res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
//     res.write('<h1>Express서버에서 응답한 결과입니다.</h1>');
//     res.write('<div><p>Param id : ' + paramId + '</p></div>');
//     res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
//     res.end();
// });
//
// app.use('/', function(req, res, next){
//     console.log('두번째 미들웨어에서 요청을 처리함.');
//
//     res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
//     res.end('<h1>Express 서버에서' + req.user + '가 응답한 결과입니다.</h1>');
// });

app.listen(app.get('port'), function(){
    console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});