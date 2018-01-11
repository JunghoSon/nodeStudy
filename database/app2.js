var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var app = express();
var router = express.Router();

var database;
var UserSchema;
var UserModel;

app.set('port', process.env.PORT || 8083);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());

//TODO : express-session option 확인
app.use(expressSession({
    secret: 'mySeretKey',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

router.post('/process/login', function(req, res){
    var id = req.body.id;
    var pw = req.body.password;

    if(database){
        authUser(database, id, pw, function(err, docs){
            if(err) throw err;

            if(docs){
                console.dir(docs);

                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>아이디: ' + id + '</p></div>');
                res.write('<div><p>패스워드: ' + pw + '</p></div>');
                res.write('<a href="/login.html">다시 로그인하기.</a>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 확인해주세요.</p></div>');
                res.write('<a href="/login.html">다시 로그인하기.</a>');
                res.end();
            }
        });
    }else{
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

router.post('/process/addUser', function(req, res){
    var id = req.body.id;
    var pw = req.body.password;
    var name = req.body.name;

    if(database){
        addUser(database, id, pw, name, function(err, result){
            if(err) throw err;

            if(result){
                console.dir(result);

                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 성공</h1>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 실패</h1>');
                res.end();
            }
        });
    }else{
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

app.use('/', router);

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

function connectDB(){
    var databaseURL = 'mongodb://localhost:27017/shopping';

    mongoose.connect(databaseURL);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error.'));

    database.on('open', function(){
        console.log('데이터베이스에 연결되었습니다 : %s', databaseURL);

        UserSchema = mongoose.Schema({
            id: String,
            password: String,
            name: String
        });

        UserModel = mongoose.model('users', UserSchema);
        console.log('users 정의함.');
    });

    database.on('disconnected', connectDB);
}

var authUser = function(database, id, pw, callback){
    console.log('authUser 호출됨.');

    UserModel.find({id: id, password: pw}, function(err, results){
        if(err){
            callback(err, null);
            return;
        }

        console.log('아이디 [%s], 비밀번호 [%s]로 사용자 검색 결과', id, pw);
        console.dir(results);

        if(results.length > 0) {
            console.log('아이디 [%s], 비밀번호 [%s]와 일치하는 사용자를 찾음', id, pw);
            callback(null, results);
        }else{
            console.log('일치하는 사용자를 찾지 못함');
            callback(null, null);
        }
    });
};

var addUser = function(database, id, pw, name, callback){
    console.log('addhUser 호출됨.');

    var user = new UserModel({
        id: id,
        password: pw,
        name: name
    });

    user.save(function(err){
        if(err){
            callback(err, null);
            return;
        }

        console.log('사용자 데이터 추가함');
        callback(null, user);
    });
};

app.listen(app.get('port'), function(){
    console.log('Server is running on %d', app.get('port'));

    connectDB();
});