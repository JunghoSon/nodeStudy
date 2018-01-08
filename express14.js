var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();
var router = express.Router();

app.set('port', process.env.PORT || 8083);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret: 'myKeyStudy',
    resave: true,
    saveUninitialized:true
}));

app.use(express.static(path.join(__dirname, 'public')));

router.post('/process/login/:name', function(req, res){
    console.log('/process/login 처리함.');

    var paramName = req.params.name;

    var paramId = req.body.uid || req.query.uid;
    var paramPassword = req.body.upw || req.query.upw;

    if(req.session.user){
        console.log('이미 로그인되어 상품 페이지로 이동합니다');

        res.redirect('/product.html');
    }else{
        req.session.user = {
            id: paramId,
            name: paramName,
            authorized: true
        };
    }

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h1>로그인 성공!</h1>');
    res.write('<div><p>Param name : ' + paramName + '</p></div>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write('<a href="/product.html">상품 페이지로 이동하기</a>');
    res.end();
});

router.get('/process/logout', function(req, res){
    console.log('/process/logout 호출됨.');

    if(req.session.user){
        console.log('로그아웃 합니다.');

        req.session.destroy(function(err){
            if(err) throw err;

            console.log('세션을 삭제하고 로그아웃 되었습니다.');

            res.redirect('/login2.html');
        });
    }else{
        console.log('아직 로그인되어 있지 않습니다.');

        res.redirect('/login2.html');
    }
});

router.get('/process/users/:id', function(req, res){
    var paramId = req.params.id;

    console.log('/process/users 와 토큰 %s를 사용해 처리함', paramId);

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h1>Express서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.end();
});

router.get('/process/showCookie', function(req, res){
    console.log('/process/showCookie 호출됨');

    res.send(req.cookies);
});

router.get('/process/setUserCookie', function(req, res){
    console.log('/process/setUserCookie 호출됨');

    res.cookie('user', {
        id: 'rick',
        name: '정호',
        authorized: true
    });

    res.redirect('/process/showCookie');
});

router.get('/process/product', function(req, res){
    if(req.session.user){
        res.redirect('/product.html');
    }else{
        res.redirect('/login2.html');
    }
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